// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get tomorrow's date in YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Fetch all confirmed/pending bookings for tomorrow
    const bookings = await base44.asServiceRole.entities.Booking.filter({
      preferred_date: tomorrowStr,
    });

    const eligible = bookings.filter(
      (b) => b.status !== 'cancelled' && b.client_email
    );

    let sent = 0;

    for (const booking of eligible) {
      const isCourse = booking.service_category === 'Beginner Nail Course';

      const subject = isCourse
        ? `📅 Reminder: Your Nail Course starts tomorrow, ${booking.client_name?.split(' ')[0]}!`
        : `💅 Reminder: Your appointment is tomorrow, ${booking.client_name?.split(' ')[0]}!`;

      const body = isCourse
        ? `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: auto; padding: 32px; background: #fff8f6; border-radius: 16px; border: 1px solid #f3d5cc;">
            <h2 style="color: #8b4a52; font-size: 24px; margin-bottom: 4px;">You're starting your Nail Course tomorrow! 🎓</h2>
            <p style="color: #555; font-size: 15px;">Hi <strong>${booking.client_name}</strong>, just a friendly reminder from <strong>Bloom Skills &amp; Beauty</strong>.</p>
            <div style="background: #fff; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #f0ddd9;">
              <p style="margin: 6px 0; color: #333;"><strong>📍 Location:</strong> Sangro House, Durban</p>
              <p style="margin: 6px 0; color: #333;"><strong>📅 Start Date:</strong> ${booking.preferred_date}</p>
              <p style="margin: 6px 0; color: #333;"><strong>🎓 Course:</strong> ${booking.service_detail}</p>
            </div>
            <p style="color: #555; font-size: 14px;">Please make sure you're on time and bring any required materials. We're so excited to have you!</p>
            <p style="color: #555; font-size: 14px;">If you have any questions, WhatsApp us at <strong>079 806 0310</strong>.</p>
            <p style="color: #8b4a52; font-size: 14px; margin-top: 24px;">With love 🌸<br/><strong>Bloom Skills &amp; Beauty</strong></p>
          </div>
        `
        : `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: auto; padding: 32px; background: #fff8f6; border-radius: 16px; border: 1px solid #f3d5cc;">
            <h2 style="color: #8b4a52; font-size: 24px; margin-bottom: 4px;">Your appointment is tomorrow! 💅</h2>
            <p style="color: #555; font-size: 15px;">Hi <strong>${booking.client_name}</strong>, just a friendly reminder from <strong>Bloom Skills &amp; Beauty</strong>.</p>
            <div style="background: #fff; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #f0ddd9;">
              <p style="margin: 6px 0; color: #333;"><strong>📍 Location:</strong> Sangro House, Durban</p>
              <p style="margin: 6px 0; color: #333;"><strong>📅 Date:</strong> ${booking.preferred_date}</p>
              <p style="margin: 6px 0; color: #333;"><strong>⏰ Time:</strong> ${booking.preferred_time}</p>
              <p style="margin: 6px 0; color: #333;"><strong>💅 Service:</strong> ${booking.service_detail}</p>
            </div>
            <p style="color: #555; font-size: 14px;">Please arrive a few minutes early. We can't wait to see you!</p>
            <p style="color: #555; font-size: 14px;">Need to reschedule? WhatsApp us at <strong>079 806 0310</strong> as soon as possible.</p>
            <p style="color: #8b4a52; font-size: 14px; margin-top: 24px;">With love 🌸<br/><strong>Bloom Skills &amp; Beauty</strong></p>
          </div>
        `;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: booking.client_email,
        subject,
        body,
        from_name: 'Bloom Skills & Beauty',
      });

      sent++;
    }

    console.log(`Reminders sent: ${sent}, skipped (no email): ${bookings.length - eligible.length}`);

    return Response.json({
      success: true,
      date: tomorrowStr,
      total_bookings: bookings.length,
      reminders_sent: sent,
      skipped_no_email: bookings.length - eligible.length,
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});