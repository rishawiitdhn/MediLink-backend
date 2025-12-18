const mongoose = require("mongoose");
const Patient = require("./patientModel");
const Doctor = require("./doctorModel");
const Hospital = require("./hospitalModel");

const MedicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  recordType: {
    type: String,
    enum: ["lab", "prescription"],
    required: true,
  },
  fileURL: {
    type: String,
    default:
      "https://loio.com/strapi/templates/free-templates/image/MEDICAL_RECORDS_RELEASE_FORM_24ad4e59d3-preview-0.jpg",
  },
  description: String,
  dateUploaded: {
    type: Date,
    default: Date.now,
  },
});

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);
module.exports = MedicalRecord;
