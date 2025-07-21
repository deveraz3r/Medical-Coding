const mongoose = require("mongoose");

const ehrSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recordType: {
      type: String,
      enum: ["Consultation", "Lab Result", "Prescription", "Imaging", "Surgery", "Vaccination"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verificationDate: Date,
    attachments: [
      {
        fileUrl: String,
        fileType: String,
        uploadDate: Date
      }
    ],
    metadata: {
      department: String,
      location: String,
      diagnosis: [String],
      symptoms: [String]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EHR", ehrSchema);
