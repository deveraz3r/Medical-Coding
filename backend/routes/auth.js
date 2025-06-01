const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { compare } = require('bcrypt');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phone, role } = req.body;
    try {
        if(await User.findOne({ email }))
            return res.status(400).json({ message: 'Email Already in Use' });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hash, gender, dateOfBirth, bloodGroup, phone, role });
        await user.save();
        res.status(201).json({ message: 'User Registered' });
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

module.exports = router;