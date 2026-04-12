// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Invite owner as admin
    await base44.users.inviteUser("bloomskillsandbeauty@icloud.com", "admin");
    
    return Response.json({ 
      success: true, 
      message: "Admin invitation sent to bloomskillsandbeauty@icloud.com" 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});