const mongoose = require("mongoose");

const Hospital = require("./hospitalModel");
const Patient = require("./patientModel");
const Doctor = require("./doctorModel");
const Pharmacy = require("./pharmacyModel");

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
  },
  medicines: [
    {
        name:{
            type: String,
            required: true,
        },
        dose:{
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        instruction:{
          type:String,
          required: true
        }
    }
  ],
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  status:{
    type: String,
    enum: ["pending", "dispensed"],
    default: "pending",
  }
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
module.exports = Prescription;
