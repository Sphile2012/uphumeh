// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { event, data } = payload;

    // Only process user creation events
    if (!event || event.type !== 'create' || event.entity_name !== 'User') {
      return Response.json({ skipped: true });
    }

    // Check if email matches owner
    if (data && data.email === 'bloomskillsandbeauty@icloud.com') {
      try {
        // Try to fetch and update the user
        const users = await base44.asServiceRole.entities.User.filter({ email: data.email });
        if (users && users.length > 0) {
          const user = users[0];
          if (user.role !== 'admin') {
            await base44.asServiceRole.entities.User.update(user.id, { role: 'admin' });
            console.log(`Admin role granted to ${data.email}`);
          }
          return Response.json({ success: true, message: 'Admin role confirmed' });
        }
      } catch (updateError) {
        console.log(`Could not update user immediately: ${updateError.message}`);
      }
    }

    return Response.json({ skipped: true, message: 'Email does not match owner' });
  } catch (error) {
    console.error('Error setting admin role:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});