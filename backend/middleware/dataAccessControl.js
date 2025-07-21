const DataAccessLogs = require("../models/DataAccessLog");

const checkAccess = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const userId = req.user._id;

    // If user is the patient, allow access
    if (patientId === userId.toString()) {
      return next();
    }

    // If user is admin, allow access
    if (req.user.role === "admin") {
      return next();
    }

    // Check for approved, valid access
    const access = await DataAccessLogs.findOne({
      patientId,
      requestedBy: userId,
      status: "approved",
      validUntil: { $gt: new Date() }
    });

    if (!access) {
      return res.status(403).json({ message: "Access denied. No valid permission found." });
    }

    // Attach access level to request
    req.accessLevel = access.accessType;

    // Log the access event into accessLog array
    access.accessLog.push({
      accessedAt: new Date(),
      action: "read", // or "view", "download" etc., based on context
      recordId: null // can be filled later if you're accessing a specific EHR
    });

    await access.save();

    next();
  } catch (err) {
    console.error("Access check error:", err);
    res.status(500).json({ message: "Error checking access permissions" });
  }
};

module.exports = { checkAccess };
