const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { compare } = require('bcrypt');
const router = express.Router();
const sendVerificationEmail = require('../services/emailService');

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phone, role } = req.body;
    try {
        if(await User.findOne({ email }))
            return res.status(400).json({ message: 'Email Already in Use' });

        const hash = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = new User({ firstName, lastName, email, password: hash, gender, dateOfBirth, bloodGroup, phone, role, emailVerificationToken: verificationToken, emailVerificationExpires: verificationExpires });
        await user.save();

        const emailSent = await sendVerificationEmail(email, verificationToken, firstName);
        if (!emailSent) {
            return res.status(500).json({ message: 'User created but failed to send verification email. Please contact support.' });
        }
        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.', userId: user._id });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user)
            return res.status(400).json({ message: 'Invalid Credentials' });

        if(!user.isEmailVerified) {
            return res.status(401).json({ 
                message: 'Please verify your email before logging in',
                requiresVerification: true 
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword)
            return res.status(400).json({ message: 'Invalid Credentials' });

        const checkRole = (role === user.role ? true : false);
        if(!checkRole)
            return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired verification token' 
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({ 
            message: 'Email verified successfully! You can now login.' 
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Email verification failed' });
    }
});

router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        const emailSent = await sendVerificationEmail(email, verificationToken, user.firstName);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Failed to resend verification email' });
    }
});

module.exports = router;