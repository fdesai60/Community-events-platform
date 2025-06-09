const express = require('express');
const fetch = require('node-fetch'); 
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const router = express.Router();

router.post('/make-staff', async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next({ status: 400, msg: 'Missing email' });

  try {
    const getUserRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${email}`, {
      headers: {
        apiKey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });

    if (!getUserRes.ok) {
      const error = await getUserRes.text();
      return next({ status: getUserRes.status, msg: error });
    }

    const userData = await getUserRes.json();

    if (!userData || !userData.users || userData.users.length === 0) {
      return next({ status: 404, msg: 'User not found' });
    }
    
    const userId = userData.users[0].id;
    
    const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apiKey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        user_metadata: {
          role: 'staff',
        },
      }),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      return next({ status: 500, msg: updateData || 'Failed to update user role' });
    }

    res.json({ success: true, user: updateData });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
