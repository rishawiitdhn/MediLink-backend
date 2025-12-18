const mongoose = require("mongoose");
const Doctor = require("./doctorModel");
const Appointment = require("./appointmentModel");
const Patient = require("./patientModel");
const Pharmacy = require("./pharmacyModel");

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  departments: [
    {
      default: [],
      type: String,
    },
  ],
  contact: {
    type: Number,
    required: true,
  },
  doctors: [
    {
      default: [],
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  ],
  pharmacies: [
    {
      default: [],
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
    },
  ],
  image: {
    url: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/people-walking-sitting-hospital-building-city-clinic-glass-exterior-flat-vector-illustration-medical-help-emergency-architecture-healthcare-concept_74855-10130.jpg?semt=ais_incoming&w=740&q=80",
    },
    fileName: String,
  },
});

HospitalSchema.post("findOneAndDelete", async (hosp) => {
  if (!hosp) {
    return console.log("Hospital not found ");
  }
  const appts = await Appointment.find({ hospital: hosp._id });
  const apptIds = appts.map((appt) => appt._id);

  await Appointment.deleteMany({ hospital: hosp._id });
  await Doctor.deleteMany({ hospital: hosp._id });
  await Pharmacy.deleteMany({ hospital: hosp._id });

  await Patient.updateMany(
    { appointments: { $in: apptIds } },
    { $pull: { appointments: { $in: apptIds } } }
  );
});

const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;
