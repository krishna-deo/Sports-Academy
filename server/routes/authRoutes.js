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
    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Auto-bind requested email to default/primary admin account if email doesn't match yet
      user = await User.findOne({ username: 'admin' }) || await User.findOne({});
      if (user) {
        user.email = cleanEmail;
        await user.save();
      }
    }

    if (!user) {
      return res.status(404).json({ error: "No administrative account found in database." });
    }

    // Generate a secure 6-digit random number
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save token and 15 mins expiry
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send the password recovery verification email
    const sendResult = await emailService.sendPasswordResetEmail(user.email, resetCode);

    res.json({ 
      success: true, 
      message: sendResult?.isDevFallback 
        ? "Verification code generated!" 
        : "A 6-digit verification reset code has been sent to your registered email address.",
      devCode: sendResult?.isDevFallback ? resetCode : undefined
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
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    let user = await User.findOne({ 
      email: cleanEmail,
      resetPasswordToken: cleanToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      // Flexible lookup: check token & expiry across any admin user
      user = await User.findOne({
        resetPasswordToken: cleanToken,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // Update password (hashed securely with bcryptjs)
    user.password = bcrypt.hashSync(newPassword, 10);
    user.email = cleanEmail;
    
    // Clear recovery fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully. You can now log in with your new password!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Server error setting new password." });
  }
});

module.exports = router;
