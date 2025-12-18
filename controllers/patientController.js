const mongoose = require("mongoose");

const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const Appointment = require("../models/appointmentModel");
const Hospital = require("../models/hospitalModel");
const sendEmail = require("../utils/sendEmailConfig");

module.exports.bookAppointment = async (req, res) => {
  const { patientId, doctorId, hospitalId } = req.params;
  const { date } = req.body;
  try {
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId).populate("appointments");
    const hospital = await Hospital.findById(hospitalId);
    if (!patient || !doctor || !hospital) {
      return res.status(404).json({ message: "Can't take the appointment!" });
    }

    const existing = await Appointment.findOne({
      patient: patientId,
      doctor: doctorId,
      date,
    });

    let emailMessage =
      "Your appointment is booked successfully. Go to Upcoming appointments section for more details. Thankyou for choosing us:)";
    if (existing) {
      //removing appointment from doctor appointments
      const doctor = await Doctor.findById(doctorId);
      doctor.appointments = doctor.appointments.filter(
        (appt) => !appt._id.equals(existing._id)
      );
      await doctor.save();

      //deleting appointment:
      await Appointment.findByIdAndDelete(existing._id);

      emailMessage =
        "Your appointment got cancelled successfully. Thankyou for choosing us:)";
      return res.json({ type: "info", message: "Changes updated!" });
    }

    const todayDate = new Date();
    if (date < todayDate.toISOString().split("T")[0]) {
      return res.json({ type: "info", message: "Try upcoming dates!!" });
    }
    const todayAppointments = doctor.appointments.filter((appt) => {
      return appt.date.toDateString() === new Date(date).toDateString();
    });

    //checking the maximum limit of appointment per day!!
    if (todayAppointments.length >= 50) {
      return res.json({
        type: "info",
        message:
          "The doctor’s appointment quota for today has been fully utilized. Please select some other date.",
      });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      hospital: hospitalId,
      date: new Date(date),
    });

    // console.log(date);
    // console.log(todayDate.toISOString().split("T")[0]);
    const result = await newAppointment.save();

    //saving appointments into doctor and patients:
    doctor.appointments.push(result._id);
    patient.appointments.push(result._id);
    await patient.save();
    await doctor.save();

    res.json({ type: "success", message: "Appointment booked successfully!" });
    await sendEmail({
      to: patient.email,
      subject: "Appointment Status Update",
      html: emailMessage,
      hospitalName: hospital.name,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during booking appointment: ", err);
  }
};

module.exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    await Appointment.findByIdAndDelete(appointmentId);
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during deleting appointment: ", err);
  }
};

module.exports.getAllAppointments = async (req, res) => {
  const { patientId } = req.params;
  try {
    const appointments = await Appointment.find({ patient: patientId })
      .populate("hospital")
      .populate("doctor");

    const todayDate = new Date().toLocaleDateString("en-CA");
    const upcomingAppointments = appointments.filter(
      (appt) => appt.date.toLocaleDateString("en-CA") >= todayDate
    );

    const patient = await Patient.findById(patientId);
    if (!patient)
      return res.status(404).json({ message: "Patient not found!!" });

    patient.appointments = upcomingAppointments;
    await patient.save();
    // console.log(upcomingAppointments);
    res.json(upcomingAppointments);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during getting appointments: ", err);
  }
};

module.exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during fetching all patients: ", err);
  }
};

module.exports.getPatientById = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patient = await Patient.findById(patientId)
      .populate({
        path: "appointments",
        populate: {
          path: "doctor",
        },
      })
      .populate("medicalRecords")
      .populate("prescriptions");
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during fetching patient by id: ", err);
  }
};

module.exports.getPrescriptionByPatientId = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patient = await Patient.findById(patientId).populate({
      path: "prescriptions",
      populate: [{ path: "doctor" }, { path: "hospital" }],
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found!!" });
    }
    res.json(patient.prescriptions);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during fetching prescription by patientId: ", err);
  }
};
