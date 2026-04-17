import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { createHash } from 'node:crypto';

/**
 * PayFast requires application/x-www-form-urlencoded encoding.
 * URLSearchParams encodes spaces as '+' which matches PayFast's generator.
 */
function buildSignatureString(data: Record<string, string>, passphrase: string): string {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(data)) {
    params.append(key, val);
  }
  if (passphrase) {
    params.append('passphrase', passphrase);
  }
  return params.toString();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { grade, tier, amount } = await req.json();

    if (!grade || !tier || !amount) {
      return Response.json({ error: 'Missing required fields: grade, tier, amount' }, { status: 400 });
    }

    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID');
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY');
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || '';

    if (!merchantId || !merchantKey) {
      return Response.json({ error: 'PayFast credentials not configured. Set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY.' }, { status: 500 });
    }

    const isSandbox = Deno.env.get('PAYFAST_SANDBOX') === 'true';
    const paymentUrl = isSandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';

    const appOrigin = (Deno.env.get('APP_ORIGIN') || 'https://princemath.co.za').replace(/\/$/, '');
    const appId = Deno.env.get('BASE44_APP_ID') || '';

    // Split name safely — PayFast requires non-empty name_first and name_last
    const nameParts = (user.full_name || 'Student User').trim().split(' ');
    const nameFirst = nameParts[0] || 'Student';
    const nameLast = nameParts.slice(1).join(' ') || 'User';

    // Sanitize amount — strip any non-numeric characters except dot
    const amountNum = parseFloat(String(amount).replace(/[^0-9.]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // PayFast payment data — field ORDER matters for signature, do not change
    const paymentData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appOrigin}/PaymentSuccess`,
      cancel_url: `${appOrigin}/Pricing`,
      notify_url: `https://api.base44.com/api/apps/${appId}/functions/payfastWebhook`,

      // Customer details
      name_first: nameFirst,
      name_last: nameLast,
      email_address: user.email,

      // Transaction details
      m_payment_id: `${user.id}_${Date.now()}`,
      amount: amountNum.toFixed(2),
      item_name: `${grade} ${tier} Subscription`,
      item_description: `Monthly subscription for ${grade} Mathematics - ${tier} Plan`,

      // Custom fields
      custom_str1: String(user.id),
      custom_str2: grade,
      custom_str3: tier,

      // Subscription (recurring)
      subscription_type: '1',
      billing_date: new Date().toISOString().split('T')[0],
      recurring_amount: amountNum.toFixed(2),
      frequency: '3',
      cycles: '0',
    };

    // Build signature using URLSearchParams (spaces → '+', PayFast standard)
    const signatureString = buildSignatureString(paymentData, passphrase);
    const signature = createHash('md5').update(signatureString).digest('hex');

    return Response.json({
      paymentUrl,
      paymentData: { ...paymentData, signature },
    });
  } catch (error) {
    console.error('createPayFastPayment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});