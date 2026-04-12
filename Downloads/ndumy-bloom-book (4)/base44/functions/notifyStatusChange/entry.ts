import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { booking } = body;

    if (!booking || !booking.client_email) {
      return Response.json({ success: false, reason: 'No booking or email' });
    }

    const ownerPhone = "27798060310";
    const ownerWhatsAppLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(`Hi Bloom Skills & Beauty! I have a question about my booking for ${booking.service_detail} on ${booking.preferred_date}.`)}`;
    const isConfirmed = booking.status === "confirmed";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin:0; padding:0; background:#f8f4f0; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; padding:24px 16px; }
  .card { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.08); }
  .header { background:${isConfirmed ? 'linear-gradient(135deg,#1a73e8,#4fa3ff)' : 'linear-gradient(135deg,#e53935,#ff7961)'}; padding:40px 32px; text-align:center; }
  .header .emoji { font-size:52px; margin-bottom:8px; display:block; }
  .header h1 { margin:0; color:#fff; font-size:26px; font-weight:800; }
  .header p { margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px; }
  .body { padding:32px; }
  .greeting { font-size:18px; color:#2d2020; font-weight:600; margin-bottom:8px; }
  .subtext { font-size:14px; color:#888; line-height:1.6; margin-bottom:24px; }
  .booking-card { background:linear-gradient(135deg,#fdf6f7,#fef9f0); border:1px solid #f0dde0; border-radius:16px; padding:24px; margin-bottom:24px; }
  .booking-card .row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(192,96,112,0.1); font-size:14px; }
  .booking-card .row:last-child { border-bottom:none; }
  .booking-card .row .key { color:#999; }
  .booking-card .row .val { font-weight:700; color:#2d2020; }
  .info-box { border-radius:12px; padding:16px 20px; font-size:13px; line-height:1.6; margin-bottom:24px; ${isConfirmed ? 'background:#e8f5e9; color:#2e7d32;' : 'background:#fce4ec; color:#b71c1c;'} }
  ${isConfirmed ? `.payment-box { background:#fff8e7; border:1px solid #f5e0a0; border-radius:12px; padding:20px; margin-bottom:24px; text-align:center; }
  .payment-box .title { font-size:13px; font-weight:600; color:#8a6000; margin-bottom:8px; }
  .payment-box .account { font-size:22px; font-weight:800; color:#c06070; letter-spacing:2px; }
  .payment-box .bank { font-size:12px; color:#888; margin-top:4px; }` : ''}
  .btn { display:block; text-align:center; padding:16px 24px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; margin-bottom:12px; background:#25D366; color:#fff; }
  .footer { background:#faf8f6; padding:20px 32px; text-align:center; font-size:12px; color:#aaa; border-top:1px solid #f0ebe5; }
</style></head>
<body>
<div class="wrapper"><div class="card">
  <div class="header">
    <span class="emoji">${isConfirmed ? '✅' : '❌'}</span>
    <h1>${isConfirmed ? 'Booking Confirmed!' : 'Booking Cancelled'}</h1>
    <p>${isConfirmed ? 'Your appointment is locked in 🌸' : 'Your appointment has been cancelled'}</p>
  </div>
  <div class="body">
    <div class="greeting">Hi ${booking.client_name}! ${isConfirmed ? '🌸' : '😔'}</div>
    <div class="subtext">
      ${isConfirmed
        ? `Great news! Your appointment at <strong>Bloom Skills &amp; Beauty</strong> has been <strong>confirmed</strong>. We can't wait to see you!`
        : `We're sorry to inform you that your appointment at <strong>Bloom Skills &amp; Beauty</strong> has been <strong>cancelled</strong>. Please contact us to rebook.`
      }
    </div>

    <div class="booking-card">
      <div class="row"><span class="key">💅 Service</span><span class="val">${booking.service_detail}</span></div>
      <div class="row"><span class="key">📅 Date</span><span class="val">${booking.preferred_date}</span></div>
      <div class="row"><span class="key">⏰ Time</span><span class="val">${booking.preferred_time}</span></div>
      <div class="row"><span class="key">📍 Location</span><span class="val">Sangro House, Durban</span></div>
    </div>

    ${isConfirmed ? `
    <div class="payment-box">
      <div class="title">💳 Please complete payment — FNB Direct Deposit</div>
      <div class="account">631 935 53469</div>
      <div class="bank">First National Bank • Use your name as reference</div>
    </div>
    <div class="info-box">✅ Please arrive 5 minutes early. If you need to cancel or reschedule, please let us know at least 24 hours in advance via WhatsApp.</div>
    ` : `
    <div class="info-box">❌ If this cancellation was unexpected or you'd like to rebook, please reach out to us via WhatsApp and we'll be happy to assist you.</div>
    `}

    <a href="${ownerWhatsAppLink}" class="btn">💬 Chat With Us on WhatsApp</a>
  </div>
  <div class="footer">Bloom Skills &amp; Beauty • Sangro House, Durban • 079 806 0310</div>
</div></div>
</body></html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: booking.client_email,
      subject: isConfirmed
        ? `✅ Confirmed: ${booking.service_detail} on ${booking.preferred_date} | Bloom Skills & Beauty`
        : `❌ Cancelled: ${booking.service_detail} on ${booking.preferred_date} | Bloom Skills & Beauty`,
      body: html,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
