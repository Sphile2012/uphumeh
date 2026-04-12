// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return Response.json({ error: 'No booking data' }, { status: 400 });
    }

    const ownerEmail = "bloomskillsandbeauty@icloud.com";
    const ownerPhone = "27798060310";
    const clientPhone = data.client_phone?.replace(/\D/g, '');
    const normalizedClientPhone = clientPhone?.startsWith('0') ? '27' + clientPhone.slice(1) : clientPhone;

    const whatsappClientLink = `https://wa.me/${normalizedClientPhone}?text=${encodeURIComponent(
      `Hi ${data.client_name}! 🌸 This is Bloom Skills & Beauty.\n\nThank you for booking with us! Your appointment for *${data.service_detail}* on *${data.preferred_date}* at *${data.preferred_time}* has been received and is pending confirmation.\n\nWe'll confirm your slot shortly. If you have any questions, feel free to reply here. 💅\n\n— Bloom Skills & Beauty`
    )}`;

    // ─── OWNER EMAIL ──────────────────────────────────────────────────────────
    const ownerHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin:0; padding:0; background:#f8f4f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; padding:24px 16px; }
  .card { background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.08); }
  .header { background:linear-gradient(135deg, #c06070 0%, #e8a0a8 100%); padding:36px 32px; text-align:center; }
  .header h1 { margin:0; color:#fff; font-size:26px; font-weight:700; letter-spacing:-0.5px; }
  .header p { margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px; }
  .badge { display:inline-block; background:rgba(255,255,255,0.25); color:#fff; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:600; margin-top:12px; letter-spacing:0.5px; text-transform:uppercase; }
  .body { padding:32px; }
  .alert-box { background:#fff8e7; border-left:4px solid #f5a623; border-radius:8px; padding:14px 18px; margin-bottom:24px; font-size:13px; color:#8a6000; }
  .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#c06070; margin:0 0 12px; }
  .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
  .detail-item { background:#faf8f6; border-radius:12px; padding:14px 16px; }
  .detail-item .label { font-size:11px; color:#999; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
  .detail-item .value { font-size:15px; font-weight:600; color:#2d2020; }
  .full-width { grid-column: 1 / -1; }
  .price-box { background:linear-gradient(135deg, #c06070, #e8a0a8); border-radius:12px; padding:20px 24px; text-align:center; margin-bottom:24px; }
  .price-box .label { color:rgba(255,255,255,0.75); font-size:12px; text-transform:uppercase; letter-spacing:1px; }
  .price-box .amount { color:#fff; font-size:36px; font-weight:800; letter-spacing:-1px; }
  .btn { display:block; text-align:center; padding:16px 24px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; margin-bottom:12px; }
  .btn-whatsapp { background:#25D366; color:#fff; }
  .btn-outline { background:#faf8f6; color:#c06070; border:2px solid #e8c0c5; }
  .notes-box { background:#f5f0eb; border-radius:12px; padding:16px 20px; margin-bottom:24px; font-size:14px; color:#555; line-height:1.6; }
  .footer { background:#faf8f6; padding:20px 32px; text-align:center; font-size:12px; color:#aaa; border-top:1px solid #f0ebe5; }
  .status-pill { display:inline-block; background:#fff3cd; color:#856404; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:600; }
  @media(max-width:480px){ .detail-grid { grid-template-columns:1fr; } .full-width { grid-column:1; } }
</style></head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div style="font-size:36px; margin-bottom:8px;">🌸</div>
      <h1>New Booking Alert!</h1>
      <p>A new appointment has just been booked</p>
      <span class="badge">⏳ Pending Confirmation</span>
    </div>
    <div class="body">
      <div class="alert-box">
        💡 <strong>Action needed:</strong> Confirm the appointment by replying to the client on WhatsApp or via email.
      </div>

      <p class="section-title">👤 Client Details</p>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="label">Full Name</div>
          <div class="value">${data.client_name}</div>
        </div>
        <div class="detail-item">
          <div class="label">Phone</div>
          <div class="value">${data.client_phone}</div>
        </div>
        <div class="detail-item full-width">
          <div class="label">Email</div>
          <div class="value">${data.client_email || '—'}</div>
        </div>
      </div>

      <p class="section-title">💅 Appointment Details</p>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="label">Category</div>
          <div class="value">${data.service_category}</div>
        </div>
        <div class="detail-item">
          <div class="label">Service</div>
          <div class="value">${data.service_detail}</div>
        </div>
        <div class="detail-item">
          <div class="label">📅 Date</div>
          <div class="value">${data.preferred_date}</div>
        </div>
        <div class="detail-item">
          <div class="label">⏰ Time</div>
          <div class="value">${data.preferred_time}</div>
        </div>
      </div>

      <div class="price-box">
        <div class="label">Service Price</div>
        <div class="amount">R${data.price || 'TBD'}</div>
      </div>

      ${data.notes ? `<p class="section-title">📝 Special Requests</p><div class="notes-box">${data.notes}</div>` : ''}

      <p class="section-title">⚡ Quick Actions</p>
      <a href="${whatsappClientLink}" class="btn btn-whatsapp">
        💬 Reply to ${data.client_name} on WhatsApp
      </a>
      ${data.client_email ? `<a href="mailto:${data.client_email}?subject=Your Bloom Skills & Beauty Appointment is Confirmed!&body=Hi ${data.client_name},%0A%0AYour appointment for ${data.service_detail} on ${data.preferred_date} at ${data.preferred_time} is confirmed! 🌸%0A%0ASee you soon!%0ABloom Skills %26 Beauty" class="btn btn-outline">✉️ Send Confirmation Email</a>` : ''}
    </div>
    <div class="footer">
      Bloom Skills &amp; Beauty • Sangro House, Durban • 079 806 0310
    </div>
  </div>
</div>
</body></html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ownerEmail,
      subject: `🌸 New Booking: ${data.client_name} — ${data.service_detail} on ${data.preferred_date}`,
      body: ownerHtml,
    });

    // ─── CLIENT CONFIRMATION EMAIL ────────────────────────────────────────────
    if (data.client_email) {
      const ownerWhatsAppLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
        `Hi Bloom Skills & Beauty! I just booked for *${data.service_detail}* on *${data.preferred_date}* at *${data.preferred_time}*. My name is ${data.client_name}. Looking forward to it! 💅`
      )}`;

      const clientHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin:0; padding:0; background:#f8f4f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  .wrapper { max-width:600px; margin:0 auto; padding:24px 16px; }
  .card { background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.08); }
  .header { background:linear-gradient(135deg, #c06070 0%, #e8a0a8 100%); padding:40px 32px; text-align:center; }
  .header .emoji { font-size:52px; margin-bottom:8px; display:block; }
  .header h1 { margin:0; color:#fff; font-size:28px; font-weight:800; }
  .header p { margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:15px; }
  .body { padding:32px; }
  .greeting { font-size:18px; color:#2d2020; font-weight:600; margin-bottom:8px; }
  .subtext { font-size:14px; color:#888; line-height:1.6; margin-bottom:28px; }
  .booking-card { background:linear-gradient(135deg, #fdf6f7, #fef9f0); border:1px solid #f0dde0; border-radius:16px; padding:24px; margin-bottom:24px; }
  .booking-card .row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(192,96,112,0.1); font-size:14px; }
  .booking-card .row:last-child { border-bottom:none; }
  .booking-card .row .key { color:#999; }
  .booking-card .row .val { font-weight:700; color:#2d2020; }
  .price-highlight { text-align:center; background:linear-gradient(135deg, #c06070, #e8a0a8); border-radius:12px; padding:18px; color:#fff; margin-bottom:24px; }
  .price-highlight .label { font-size:12px; opacity:0.8; text-transform:uppercase; letter-spacing:1px; }
  .price-highlight .amount { font-size:38px; font-weight:800; }
  .info-box { background:#e8f5e9; border-radius:12px; padding:16px 20px; font-size:13px; color:#2e7d32; line-height:1.6; margin-bottom:24px; }
  .btn { display:block; text-align:center; padding:16px 24px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; margin-bottom:12px; }
  .btn-whatsapp { background:#25D366; color:#fff; }
  .payment-box { background:#fff8e7; border:1px solid #f5e0a0; border-radius:12px; padding:20px; margin-bottom:24px; text-align:center; }
  .payment-box .title { font-size:13px; font-weight:600; color:#8a6000; margin-bottom:8px; }
  .payment-box .account { font-size:22px; font-weight:800; color:#c06070; letter-spacing:2px; }
  .payment-box .bank { font-size:12px; color:#888; margin-top:4px; }
  .footer { background:#faf8f6; padding:20px 32px; text-align:center; font-size:12px; color:#aaa; border-top:1px solid #f0ebe5; }
</style></head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <span class="emoji">💅</span>
      <h1>You're Booked!</h1>
      <p>Your appointment request has been received</p>
    </div>
    <div class="body">
      <div class="greeting">Hi ${data.client_name}! 🌸</div>
      <div class="subtext">
        Thank you for choosing <strong>Bloom Skills &amp; Beauty</strong>. We've received your booking and will confirm your slot shortly. Here's your summary:
      </div>

      <div class="booking-card">
        <div class="row"><span class="key">💅 Service</span><span class="val">${data.service_detail}</span></div>
        <div class="row"><span class="key">📂 Category</span><span class="val">${data.service_category}</span></div>
        <div class="row"><span class="key">📅 Date</span><span class="val">${data.preferred_date}</span></div>
        <div class="row"><span class="key">⏰ Time</span><span class="val">${data.preferred_time}</span></div>
        ${data.notes ? `<div class="row"><span class="key">📝 Notes</span><span class="val">${data.notes}</span></div>` : ''}
      </div>

      <div class="price-highlight">
        <div class="label">Total Amount</div>
        <div class="amount">R${data.price || 'TBD'}</div>
      </div>

      <div class="payment-box">
        <div class="title">💳 Payment — Direct Deposit (FNB)</div>
        <div class="account">62068275149</div>
        <div class="bank">First National Bank • Branch: 250355 • Use your name as reference</div>
      </div>

      <div class="info-box">
        ✅ <strong>Thank you for considering Bloom Skills &amp; Beauty!</strong><br/><br/>
        We are delighted to have you and will confirm your appointment shortly. Please ensure you arrive at least <strong>10 minutes early</strong> on the day. 
        Should you need to cancel or make any changes, kindly notify us via WhatsApp at least 24 hours in advance. We look forward to seeing you! 🌸
      </div>

      <a href="${ownerWhatsAppLink}" class="btn btn-whatsapp">
        💬 Chat With Us on WhatsApp
      </a>
    </div>
    <div class="footer">
      Bloom Skills &amp; Beauty • Sangro House, Durban • 079 806 0310 • Hours: 8am–4pm
    </div>
  </div>
</div>
</body></html>`;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: data.client_email,
        subject: `💅 Booking Received — ${data.service_detail} on ${data.preferred_date} | Bloom Skills & Beauty`,
        body: clientHtml,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});