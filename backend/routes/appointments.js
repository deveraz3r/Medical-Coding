const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

// Apply authentication to all routes
router.use(authenticate);

// Get all appointments (admin only)
router.get("/", authorize("admin"), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error("GET /api/appointments error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get upcoming appointments
router.get("/upcoming", async (req, res) => {
  const { role, _id } = req.user;
  try {
    const filter = role === "doctor" ? { doctorId: _id } : { patientId: _id };
    const appointments = await Appointment.find({
      ...filter,
      date: { $gte: new Date() },
      status: { $ne: "Completed" } // Exclude completed appointments
    })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error("GET /api/appointments/upcoming error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// History of appointments (both for patient and providers)
router.get("/history", authenticate, async (req, res) => {
  // const { role, _id: userId } = req.user;
  const role = req.user.role;
  const userId = req.user._id.toString();

  try {
    const filter = role === "doctor" ? { doctorId: userId } : { patientId: userId };

    // Update appointments with past dates to "Missed" if not completed or canceled
    await Appointment.updateMany(
      { ...filter, date: { $lt: new Date() }, status: { $nin: ["Completed", "Cancelled", "Missed"] } },
      { $set: { status: "Missed" } }
    );

    // Fetch appointments that are either in the past or have specific statuses
    const appointments = await Appointment.find({
      ...filter,
      $or: [{ date: { $lt: new Date() } }, { status: { $in: ["Missed", "Completed", "Cancelled"] } }]
    })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("GET /api/appointments/history error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Book appointment (patient only)
router.post("/", authorize("patient"), async (req, res) => {
  const { patientId, doctorId, date, time, reason } = req.body;
  try {
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    const patient = await User.findOne({ _id: patientId, role: "patient" });
    if (!patient) return res.status(400).json({ message: "Patient not found" });

    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $nin: ["Cancelled"] }
    });
    if (conflictingAppointment) return res.status(400).json({ message: "Time slot not available" });

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      reason
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    console.error("POST /api/appointments error: ", err);
    res.status(400).json({ message: err.message });
  }
});

// Update appointment status (doctor only)
router.patch("/:id/status", authorize("doctor"), async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (err) {
    console.error(`PATCH /api/appointments/${req.params.id}/status error: `, err);
    res.status(400).json({ message: err.message });
  }
});

// Cancel appointment (patient or doctor)
router.delete("/:id", authenticate, async (req, res) => {
  const role = req.user.role;
  const userId = req.user._id.toString();

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if ((role === "patient" && appointment.patientId.toString() !== userId) || (role === "doctor" && appointment.doctorId.toString() !== userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error(`DELETE /api/appointments/${req.params.id} error: `, err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
