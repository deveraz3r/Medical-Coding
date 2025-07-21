const express = require("express");
const router = express.Router();
const EHR = require("../models/Ehr");
const { authenticate, authorize } = require("../middleware/auth");
const { checkAccess } = require("../middleware/dataAccessControl");

// CREATE access request (e.g., by doctor)
router.post("/access-request", authenticate, async (req, res) => {
  try {
    const { patientId, accessType, purpose, validFrom, validUntil } = req.body;

    // Prevent self-request
    if (req.user._id.toString() === patientId) {
      return res.status(400).json({ message: "You cannot request access to your own records." });
    }

    // Prevent duplicate pending/active access requests
    const existing = await DataAccessLog.findOne({
      patientId,
      requestedBy: req.user._id,
      status: { $in: ["pending", "approved"] },
      validUntil: { $gt: new Date() }
    });

    if (existing) {
      return res.status(400).json({ message: "An active or pending access request already exists." });
    }

    const accessRequest = new DataAccessLog({
      patientId,
      requestedBy: req.user._id,
      accessType,
      purpose,
      validFrom,
      validUntil
    });

    const saved = await accessRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating access request:", err);
    res.status(500).json({ message: "Server Error" });
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

module.exports = router;
