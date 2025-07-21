const express = require("express");
const Doctor = require("../models/Doctor");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all doctors (public route, no auth needed)
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "firstName lastName");
    res.json(doctors);
  } catch (err) {
    console.error("GET /api/doctors error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get doctor profile (doctors can only access their own profile)
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "firstName lastName");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if doctor is accessing their own profile
    if (doctor.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(doctor);
  } catch (err) {
    console.error(`GET /api/doctors/${req.params.id} error:`, err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create doctor profile (only for users with doctor role)
router.post("/", authorize("doctor"), async (req, res) => {
  try {
    const doctor = new Doctor({
      ...req.body,
      user: req.user._id
    });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.error("POST /api/doctors error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Update doctor profile (doctors can only update their own profile)
router.put("/:id", authorize("doctor"), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if doctor is updating their own profile
    if (doctor.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    console.error(`PUT /api/doctors/${req.params.id} error:`, err);
    res.status(400).json({ message: err.message });
  }
});

// Delete doctor profile (admin only)
router.delete("/:id", authorize("admin"), async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor profile deleted" });
  } catch (err) {
    console.error(`DELETE /api/doctors/${req.params.id} error:`, err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
