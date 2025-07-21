const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");

// Get all users (admin only)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET /api/users error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get user by ID (authenticated users can only access their own profile)
router.get("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is requesting their own profile or is admin
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(`GET /api/users/${req.params.id} error: `, err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create new user (admin only)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const { firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phoneNumber, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email Already Registered" });
    const user = new User({ firstName, lastName, email, password, gender, dateOfBirth, bloodGroup, phoneNumber, role });
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/users error: ", err);
    res.status(400).json({ message: err.message });
  }
});

// Update user (users can only update their own profile)
router.put("/:id", authenticate, async (req, res) => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    console.error(`PUT /api/users/${req.params.id} error: `, err);
    res.status(400).json({ message: err.message });
  }
});

// Delete user (admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User Deleted" });
  } catch (err) {
    console.error(`DELETE /api/users/${req.params.id} error: `, err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
