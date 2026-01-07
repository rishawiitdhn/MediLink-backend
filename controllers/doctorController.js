const mongoose = require("mongoose");
const Doctor = require("../models/doctorModel.js");
const Pharmacy = require("../models/pharmacyModel.js");
const Patient = require("../models/patientModel.js");
const Admin = require("../models/adminModel.js");
const Prescription = require("../models/prescriptionModel.js");
const MedicalRecord = require("../models/medicalRecordModel.js");
const Hospital = require("../models/hospitalModel.js");
const Appointment = require("../models/appointmentModel.js");

module.exports.getDoctorById = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doctor = await Doctor.findById(doctorId).populate("hospital");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during fetching doctor: ", err);
  }
};

module.exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .populate("hospital")
      .populate("appointments");
    res.json(doctors);
  } catch {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during fetching doctors: ", err);
  }
};

module.exports.getAllVerifiedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ verified: true })
      .populate("hospital")
      .populate("appointments");
    res.json(doctors);
  } catch {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during fetching verified doctors: ", err);
  }
};

module.exports.getAllAppointments = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const todayDate = new Date();

  const startOfDay = new Date(todayDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(todayDate);
  endOfDay.setHours(23, 59, 59, 999);
    const appointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate("patient");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during fetching doctor appointments: ", err);
  }
};

module.exports.addPrescription = async (req, res) => {
  const { patientId, hospitalId, doctorId, pharmacyName, medicines } = req.body;
  try {
    const pharmacy = await Pharmacy.findOne({ name: pharmacyName });
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    const hospital = await Hospital.findById(hospitalId);

    if (!pharmacy || !patient || !doctor || !hospital) {
      return res
        .json(404)
        .status({
          message: "Doctor or Patient or Pharmacy not found. Try again!",
        });
    }

    const newPrescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      hospital: hospitalId,
      pharmacy: pharmacy._id,
      medicines,
    });

    const result = await newPrescription.save();

    patient.prescriptions.push(result._id);
    pharmacy.prescriptions.push(result._id);

    await patient.save();
    await pharmacy.save();
    console.log(result);
    res.json({ message: "Prescription added successfully!!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during adding prescription: ", err);
  }
};

module.exports.getDoctorsByHospitalId = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const doctors = await Doctor.find({ hospital: hospitalId });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during fetching doctors from hospital name: ", err);
  }
};

module.exports.uploadMedicalReports = async (req, res) => {
  const { patientId } = req.params;
  const { description } = req.body;
  try {
    const files = req.files;
    const patient = await Patient.findById(patientId);
    for (let file of files) {
      patient.medicalRecords.push({
        description,
        url: file.path,
        fileName: file.filename,
      });
    }
    await patient.save();
    res.json({ message: "Upload successful" });
    console.log(files);
    console.log(patient);
  } catch (err) {
    console.error("Error during fetching doctors from hospital name: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.markCompletedAppointment = async (req, res) => {
  const { patientId, doctorId } = req.body;
  try {
    const start = new Date();
    start.setHours(0,0,0,0);
    
    const end = new Date();
    end.setHours(0,0,0,0);

    const appointment = await Appointment.findOne({
      doctor: doctorId,
      patient: patientId,
      date: {$gte: start, $lte: end},
    });
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.isDone = true;
    await appointment.save();
    res.json({ message: "Appointment completed!!" });
    // res.json(appointment);
  } catch (err) {
    console.error("Error during marking completed appointment: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};
