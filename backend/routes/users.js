const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('GET /api/users error: ', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(`GET /api/users/${req.params.id} error: `, err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', async(req, res) => {
    const { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phoneNumber, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if(existing) return res.status(400).json({ message: 'Email Already Registered' });
        const user = new User({ firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phoneNumber, role });
        const saved = await user.save();
        res.status(201).json(saved);
    } catch(err) {
        console.error('POST /api/users error: ', err);
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async(req, res) => {
    const { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phoneNumber, role } = req.body;
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id, { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phoneNumber, role }, { new: true, runValidators: true }
    );
    if(!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
    } catch(err) {
        console.error(`POST /api/users/${req.params.id} error: `, err);
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User Deleted' });
    } catch (err) {
        console.error(`DELETE /api/users/${req.params.id} error: `, err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;