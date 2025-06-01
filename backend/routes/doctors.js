const express = require('express');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
    const list = await Doctor.find({ user: req.user._id });
    res.json(list);
})

router.post('/', async (req, res) => {
    const doc = new Doctor({ ...req.body, user: req.user._id });
    await doc.save();
    res.status(201).json(doc);
});

router.put('/:id', async (req, res) => {
    const doc = await Doctor.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if(!doc) return res.status(404).json({ message: 'Not Found' });
    res.json(doc);
});

router.delete('/:id', async (req, res) => {
    const doc = await Doctor.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if(!doc) return res.status(404).json({ message: 'Not Found' });
    res.json({ message: 'Deleted' });
});

module.exports = router;