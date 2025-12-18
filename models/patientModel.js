const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  appointments: [
    {
      default : [],
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  medicalRecords: [
    {
    description: {
      type: String,
      default: "General report"
    },
    date:{
      type: Date,
      default: Date.now(),
    },
    url: String,
    fileName: String
  }
],
  prescriptions: [
    {
    default: [],
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription"
  },
]
});

const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;
