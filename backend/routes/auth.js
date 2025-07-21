const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { compare } = require("bcrypt");
const router = express.Router();
const sendVerificationEmail = require("../services/emailService");
const sendResetPasswordEmail = require("../services/passwordResetEmailService");

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phone, role } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email Already in Use" });

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      gender,
      dateOfBirth,
      bloodGroup,
      phone,
      role,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });
    await user.save();

    const emailSent = await sendVerificationEmail(email, verificationToken, firstName);
    if (!emailSent) {
      return res.status(500).json({ message: "User created but failed to send verification email. Please contact support." });
    }
    res.status(201).json({ message: "Registration successful! Please check your email to verify your account.", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        requiresVerification: true
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(400).json({ message: "Invalid Credentials" });

    const checkRole = role === user.role ? true : false;
    if (!checkRole) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully! You can now login."
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    const emailSent = await sendVerificationEmail(email, verificationToken, user.firstName);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, we have sent you a password reset link."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    const resetEmailSent = await sendResetPasswordEmail(user.email, resetToken, user.firstName || user.name);

    if (resetEmailSent) {
      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email"
      });
    } else {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again."
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.get("/validate-reset-token", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required"
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset token is valid"
    });
  } catch (error) {
    console.error("Validate reset token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;
