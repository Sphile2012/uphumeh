import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { booking } = body;

    if (!booking) {
      return Response.json({ error: 'Missing booking data' }, { status: 400 });
    }

    const ownerEmail = "bloomskillsandbeauty@icloud.com";
    const ownerWhatsApp = "27798060310";

    // Send email notification to owner
    const emailBody = `
      <h2 style="color: #c06070;">🌸 New Booking Received!</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Client:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.client_name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.client_phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.client_email || 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Service:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.service_category} - ${booking.service_detail}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Price:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">R${booking.price || 'TBD'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Date:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.preferred_date}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Time:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.preferred_time}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${booking.notes || 'None'}</td></tr>
      </table>
      <p style="margin-top: 16px; color: #888;">— Bloom Skills & Beauty Booking System</p>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ownerEmail,
      subject: `🌸 New Booking: ${booking.client_name} - ${booking.service_detail}`,
      body: emailBody
    });

    // Also send confirmation email to client if they provided email
    if (booking.client_email) {
      const clientEmailBody = `
        <h2 style="color: #c06070;">🌸 Booking Confirmation</h2>
        <p>Hi ${booking.client_name},</p>
        <p>Thank you for booking with <strong>Bloom Skills & Beauty</strong>!</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Service:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.service_category} - ${booking.service_detail}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Date:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.preferred_date}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Time:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.preferred_time}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Price:</td><td style="padding: 8px;">R${booking.price || 'TBD'}</td></tr>
        </table>
        <p style="margin-top: 16px;">We'll confirm your appointment shortly. For any changes, please WhatsApp us at <strong>079 806 0310</strong>.</p>
        <p>💅 See you soon!</p>
        <p style="color: #888;">— Bloom Skills & Beauty, Sangro House</p>
      `;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: booking.client_email,
        subject: `🌸 Your Booking at Bloom Skills & Beauty is Received!`,
        body: clientEmailBody
      });
    }

    // Generate WhatsApp message link
    const whatsappMessage = encodeURIComponent(
      `🌸 *New Booking!*\n\n` +
      `*Client:* ${booking.client_name}\n` +
      `*Phone:* ${booking.client_phone}\n` +
      `*Email:* ${booking.client_email || 'N/A'}\n` +
      `*Service:* ${booking.service_category} - ${booking.service_detail}\n` +
      `*Price:* R${booking.price || 'TBD'}\n` +
      `*Date:* ${booking.preferred_date}\n` +
      `*Time:* ${booking.preferred_time}\n` +
      `*Notes:* ${booking.notes || 'None'}`
    );

    const whatsappUrl = `https://wa.me/${ownerWhatsApp}?text=${whatsappMessage}`;

    return Response.json({ 
      success: true, 
      message: 'Notifications sent successfully',
      whatsappUrl 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
