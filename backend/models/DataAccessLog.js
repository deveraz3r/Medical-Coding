const mongoose = require("mongoose");

const dataAccessLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    accessType: {
      type: String,
      enum: ["read", "write", "full"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "revoked"],
      default: "pending"
    },
    purpose: {
      type: String,
      required: true
    },
    validFrom: {
      type: Date,
      required: true
    },
    validUntil: {
      type: Date,
      required: true
    },
    accessLog: [
      {
        accessedAt: Date,
        action: String,
        recordId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EHR"
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("DataAccessLog", dataAccessLogSchema);
