const express = require("express");
const router = express.Router();
const EHR = require("../models/Ehr");
const { authenticate, authorize } = require("../middleware/auth");
const { checkAccess } = require("../middleware/dataAccessControl");

// Add new health record (doctors and patients)
router.post("/", authenticate, authorize("doctor", "patient"), async (req, res) => {
  try {
    const { patientId, doctorId, recordType, title, description, date, status, verifiedBy, verificationDate, attachments, metadata } = req.body;

    const { role, _id } = req.user;

    const ehr = new EHR({
      patientId,
      doctorId: role === "doctor" ? _id : doctorId,
      recordType,
      title,
      description,
      date: date || new Date(),
      status: role === "patient" ? "pending" : status || "verified",
      verifiedBy,
      verificationDate,
      attachments,
      metadata
    });

    await ehr.save();
    res.status(201).json(ehr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get patient's health records
router.get("/patient/:patientId", authenticate, checkAccess, async (req, res) => {
  try {
    const records = await EHR.find({ patientId: req.params.patientId })
      .populate("doctorId", "firstName lastName")
      .populate("verifiedBy", "firstName lastName")
      .sort({ date: -1 });

    const stats = {
      total: records.length,
      verified: records.filter((r) => r.status === "verified").length,
      pending: records.filter((r) => r.status === "pending").length
    };

    res.json({ records, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify health record (doctors only)
router.patch("/:id/verify", authenticate, authorize("doctor"), async (req, res) => {
  try {
    const record = await EHR.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    record.status = "verified";
    record.verifiedBy = req.user._id;
    record.verificationDate = new Date();
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get prescription history
router.get("/prescriptions/:patientId", authenticate, checkAccess, async (req, res) => {
  try {
    const prescriptions = await EHR.find({
      patientId: req.params.patientId,
      recordType: "Prescription"
    }).sort({ date: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
