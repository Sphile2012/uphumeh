// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch the owner user by email
    const users = await base44.asServiceRole.entities.User.filter({ email: 'bloomskillsandbeauty@icloud.com' });
    
    if (!users || users.length === 0) {
      return Response.json({ error: 'Owner email not found in system. Please sign up first.' }, { status: 404 });
    }

    const user = users[0];
    
    if (user.role === 'admin') {
      return Response.json({ success: true, message: 'Owner already has admin role' });
    }

    // Grant admin role
    await base44.asServiceRole.entities.User.update(user.id, { role: 'admin' });

    return Response.json({ 
      success: true, 
      message: `Admin role granted to ${user.email}. They now have access to the admin dashboard.` 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});