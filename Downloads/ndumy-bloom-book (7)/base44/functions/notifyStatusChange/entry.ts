// @ts-nocheck
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
    const isConfirmed = booking.status === "confirmed";
    const firstName = booking.client_name?.split(' ')[0] || booking.client_name;

    const ownerWhatsAppLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
      `Hi Bloom Skills & Beauty! I have a question about my booking for ${booking.service_detail} on ${booking.preferred_date}.`
    )}`;

    const confirmedHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin:0; padding:0; background:#f0f7f0; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; padding:24px 16px; }
  .card { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.08); }
  .header { background:linear-gradient(135deg,#2e7d32,#66bb6a); padding:44px 32px; text-align:center; }
  .header .emoji { font-size:56px; margin-bottom:10px; display:block; }
  .header h1 { margin:0; color:#fff; font-size:28px; font-weight:800; letter-spacing:-0.5px; }
  .header p { margin:8px 0 0; color:rgba(255,255,255,0.88); font-size:15px; }
  .body { padding:32px; }
  .greeting { font-size:19px; color:#1b2020; font-weight:700; margin-bottom:6px; }
  .subtext { font-size:14px; color:#666; line-height:1.7; margin-bottom:28px; }
  .booking-card { background:linear-gradient(135deg,#f1f8f1,#fef9f0); border:1px solid #c8e6c9; border-radius:16px; padding:24px; margin-bottom:24px; }
  .booking-card .row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid rgba(46,125,50,0.1); font-size:14px; }
  .booking-card .row:last-child { border-bottom:none; }
  .booking-card .row .key { color:#888; }
  .booking-card .row .val { font-weight:700; color:#1b2020; }
  .payment-box { background:#fff8e1; border:1px solid #ffe082; border-radius:14px; padding:22px; margin-bottom:24px; text-align:center; }
  .payment-box .title { font-size:13px; font-weight:700; color:#f57f17; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px; }
  .payment-box .account { font-size:26px; font-weight:800; color:#c06070; letter-spacing:3px; margin-bottom:4px; }
  .payment-box .bank { font-size:12px; color:#999; }
  .info-box { background:#e8f5e9; border-radius:12px; padding:16px 20px; font-size:13px; color:#2e7d32; line-height:1.7; margin-bottom:24px; }
  .btn { display:block; text-align:center; padding:16px 24px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; margin-bottom:12px; background:#25D366; color:#fff; }
  .footer { background:#f9faf9; padding:20px 32px; text-align:center; font-size:12px; color:#aaa; border-top:1px solid #e8f0e8; }
</style></head>
<body>
<div class="wrapper"><div class="card">
  <div class="header">
    <span class="emoji">✅</span>
    <h1>Your Booking is Confirmed!</h1>
    <p>We're so excited to see you, ${firstName}! 🌸</p>
  </div>
  <div class="body">
    <div class="greeting">Hi ${booking.client_name}! 💅</div>
    <div class="subtext">
      Great news — your appointment at <strong>Bloom Skills &amp; Beauty</strong> has been <strong>confirmed</strong>. 
      We've reserved your slot and we can't wait to make you look and feel amazing!
    </div>

    <div class="booking-card">
      <div class="row"><span class="key">💅 Service</span><span class="val">${booking.service_detail}</span></div>
      <div class="row"><span class="key">📅 Date</span><span class="val">${booking.preferred_date}</span></div>
      <div class="row"><span class="key">⏰ Time</span><span class="val">${booking.preferred_time}</span></div>
      <div class="row"><span class="key">📍 Location</span><span class="val">Sangro House, Durban</span></div>
      ${booking.price ? `<div class="row"><span class="key">💰 Price</span><span class="val">R${booking.price}</span></div>` : ''}
    </div>

    <div class="payment-box">
      <div class="title">💳 Complete Your Payment — FNB Direct Deposit</div>
      <div class="account">62068275149</div>
      <div class="bank">First National Bank &nbsp;•&nbsp; Branch: 250355 &nbsp;•&nbsp; Reference: ${booking.client_name}</div>
    </div>

    <div class="info-box">
      🕐 <strong>Please arrive at least 10 minutes early.</strong><br/><br/>
      Thank you so much for considering Bloom Skills &amp; Beauty — we truly appreciate your support and cannot wait to take care of you. 
      Should you need to cancel or reschedule, please notify us via WhatsApp at least <strong>24 hours before</strong> your appointment so we can accommodate another client. We look forward to seeing you! 🌸
    </div>

    <a href="${ownerWhatsAppLink}" class="btn">💬 Chat With Us on WhatsApp</a>
  </div>
  <div class="footer">
    Bloom Skills &amp; Beauty &nbsp;•&nbsp; Sangro House, Durban &nbsp;•&nbsp; 079 806 0310 &nbsp;•&nbsp; Mon–Sat 8am–4pm
  </div>
</div></div>
</body></html>`;

    const cancelledHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin:0; padding:0; background:#fdf0f0; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; padding:24px 16px; }
  .card { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.08); }
  .header { background:linear-gradient(135deg,#c62828,#ef5350); padding:44px 32px; text-align:center; }
  .header .emoji { font-size:56px; margin-bottom:10px; display:block; }
  .header h1 { margin:0; color:#fff; font-size:28px; font-weight:800; }
  .header p { margin:8px 0 0; color:rgba(255,255,255,0.88); font-size:15px; }
  .body { padding:32px; }
  .greeting { font-size:19px; color:#1b2020; font-weight:700; margin-bottom:6px; }
  .subtext { font-size:14px; color:#666; line-height:1.7; margin-bottom:28px; }
  .booking-card { background:#fdf6f6; border:1px solid #ffcdd2; border-radius:16px; padding:24px; margin-bottom:24px; }
  .booking-card .row { display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid rgba(198,40,40,0.08); font-size:14px; }
  .booking-card .row:last-child { border-bottom:none; }
  .booking-card .row .key { color:#888; }
  .booking-card .row .val { font-weight:700; color:#1b2020; }
  .info-box { background:#fce4ec; border-radius:12px; padding:16px 20px; font-size:13px; color:#b71c1c; line-height:1.7; margin-bottom:24px; }
  .btn { display:block; text-align:center; padding:16px 24px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; margin-bottom:12px; background:#25D366; color:#fff; }
  .footer { background:#fdf9f9; padding:20px 32px; text-align:center; font-size:12px; color:#aaa; border-top:1px solid #f5e0e0; }
</style></head>
<body>
<div class="wrapper"><div class="card">
  <div class="header">
    <span class="emoji">😔</span>
    <h1>Booking Cancelled</h1>
    <p>We're sorry to see you go, ${firstName}</p>
  </div>
  <div class="body">
    <div class="greeting">Hi ${booking.client_name},</div>
    <div class="subtext">
      We're sorry to let you know that your appointment at <strong>Bloom Skills &amp; Beauty</strong> has been <strong>cancelled</strong>. 
      We hope to see you again soon — please don't hesitate to rebook whenever you're ready! 💕
    </div>

    <div class="booking-card">
      <div class="row"><span class="key">💅 Service</span><span class="val">${booking.service_detail}</span></div>
      <div class="row"><span class="key">📅 Date</span><span class="val">${booking.preferred_date}</span></div>
      <div class="row"><span class="key">⏰ Time</span><span class="val">${booking.preferred_time}</span></div>
    </div>

    <div class="info-box">
      💬 If this cancellation was unexpected or you'd like to rebook, please reach out to us on WhatsApp — we'd love to find you a new slot! 🌸
    </div>

    <a href="${ownerWhatsAppLink}" class="btn">💬 Rebook on WhatsApp</a>
  </div>
  <div class="footer">
    Bloom Skills &amp; Beauty &nbsp;•&nbsp; Sangro House, Durban &nbsp;•&nbsp; 079 806 0310
  </div>
</div></div>
</body></html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: booking.client_email,
      subject: isConfirmed
        ? `✅ Confirmed! Your ${booking.service_detail} on ${booking.preferred_date} — Bloom Skills & Beauty`
        : `Your booking for ${booking.service_detail} on ${booking.preferred_date} has been cancelled`,
      body: isConfirmed ? confirmedHtml : cancelledHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
