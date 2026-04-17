import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { createHash } from 'node:crypto';

const PAYFAST_VALID_IPS = [
  '41.74.179.194', '41.74.179.195', '41.74.179.196', '41.74.179.197',
  '41.74.179.198', '41.74.179.199', '41.74.179.200', '41.74.179.201',
  '41.74.179.202', '41.74.179.203', '127.0.0.1',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const isSandbox = Deno.env.get('PAYFAST_SANDBOX') === 'true';
    if (!isSandbox) {
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                       req.headers.get('cf-connecting-ip') || '0.0.0.0';
      if (!PAYFAST_VALID_IPS.includes(clientIp)) {
        console.warn(`Rejected ITN from invalid IP: ${clientIp}`);
        return new Response('Forbidden', { status: 403 });
      }
    }

    const formData = await req.formData();
    const raw: Record<string, string> = {};
    for (const [k, v] of formData.entries()) {
      raw[k] = String(v);
    }

    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || '';
    const receivedSignature = raw['signature'] || '';

    // Build signature string — alphabetical sort, exclude signature field
    const sigParams = new URLSearchParams();
    for (const key of Object.keys(raw).filter(k => k !== 'signature').sort()) {
      sigParams.append(key, raw[key].trim());
    }
    if (passphrase) sigParams.append('passphrase', passphrase.trim());

    const expectedSignature = createHash('md5').update(sigParams.toString()).digest('hex');

    if (receivedSignature !== expectedSignature) {
      console.error('PayFast ITN: Invalid signature');
      console.error('Expected:', expectedSignature);
      console.error('Received:', receivedSignature);
      return new Response('Invalid signature', { status: 400 });
    }

    if (raw['payment_status'] === 'COMPLETE') {
      const userId = raw['custom_str1'];
      const grade = raw['custom_str2'];
      const tier = raw['custom_str3'];
      const userEmail = raw['email_address'] || '';

      if (!userId) {
        console.error('PayFast ITN: Missing user ID');
        return new Response('OK', { status: 200 });
      }

      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      await base44.asServiceRole.entities.User.update(userId, {
        subscription_tier: tier,
        grade: grade,
        subscription_end_date: subscriptionEndDate.toISOString(),
        subscription_active: true,
      });

      await base44.asServiceRole.entities.Notification.create({
        user_email: userEmail,
        message: `Your ${grade} ${tier} subscription is now active!`,
        is_read: false,
      });

      console.log(`Subscription activated for user ${userId}: ${grade} ${tier}`);
    } else if (raw['payment_status'] === 'CANCELLED') {
      console.log(`Payment cancelled for ${raw['custom_str1']}`);
    } else if (raw['payment_status'] === 'FAILED') {
      console.error(`Payment FAILED for ${raw['custom_str1']}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
