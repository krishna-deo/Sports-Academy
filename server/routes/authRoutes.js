const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'rlbsa_secure_token_secret_key_99';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password credentials." });
    }

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: "Invalid username or password credentials." });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ success: true, token, username: user.username });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during authentication." });
  }
});

// Forgot password recovery code generator
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required to request a reset code." });
  }

  try {
    let user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user && email.trim().toLowerCase() === 'admin@sportsacademy.com') {
      // Auto-heal seed admin document email if it doesn't exist yet
      user = await User.findOne({ username: 'admin' });
      if (user) {
        user.email = 'admin@sportsacademy.com';
        await user.save();
      }
    }
    if (!user) {
      return res.status(404).json({ error: "No administrative account registered with this email." });
    }

    // Generate a secure 6-digit random number
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save token and 10 mins expiry
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send the password recovery verification email
    await emailService.sendPasswordResetEmail(user.email, resetCode);

    res.json({ 
      success: true, 
      message: "A verification reset code has been sent to your email."
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Server error generating recovery code." });
  }
});

// Reset password implementation
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: "Email, verification code, and new password are required." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long." });
  }

  try {
    const user = await User.findOne({ 
      email: email.trim().toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // Update password (hashed securely with bcryptjs)
    user.password = bcrypt.hashSync(newPassword, 10);
    
    // Clear recovery fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Server error setting new password." });
  }
});

module.exports = router;
