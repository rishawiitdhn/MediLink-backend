const mongoose = require("mongoose");

const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const Appointment = require("../models/appointmentModel");
const Hospital = require("../models/hospitalModel");
const sendEmail = require("../utils/sendEmailConfig");
const Pharmacy = require("../models/pharmacyModel");

module.exports.addHospitals = async (req, res) => {
  const { name, address, email, departments, contact } = req.body;
  try {
    const newHospital = new Hospital({
      name,
      address,
      email,
      departments,
      contact,
    });
    const result = await newHospital.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during adding hospital: ", err);
  }
};

module.exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during fetching hospitals: ", err);
  }
};

module.exports.getHospitalById = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const hospital = await Hospital.findById(hospitalId).populate("doctors");
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during fetching hospitals: ", err);
  }
};

module.exports.getHospitalByName = async (req, res) => {
  const { hospitalName } = req.params;
  try {
    const hospital = await Hospital.findOne({ name: hospitalName }).populate(
      "doctors"
    );
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during fetching hospital by name: ", err);
  }
};

module.exports.updateHospital = async (req, res) => {
  const { hospitalId } = req.params;
  const { name, email, address, departments, contact } = req.body;
  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });

    // await Hospital.findByIdAndUpdate(
    //   hospitalId,
    //   { name, email, address, departments, contact },
    //   { runValidators: true }
    // );
    console.log(departments);
    hospital.name = name;
    hospital.email = email;
    hospital.address = address;
    hospital.departments = departments;
    hospital.contact = contact;

    console.log(req.file);
    if(req.file){
      hospital.image.url = req.file.path;
      hospital.image.fileName = req.file.filename;
    }
    await hospital.save();
    res.json({ message: "Hospital data updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during updating hospitals: ", err);
  }
};

module.exports.deleteHospital = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const isExist = await Hospital.findById(hospitalId);
    if (!isExist)
      return res.status(404).json({ message: "Hospital not found" });

    await Hospital.findByIdAndDelete(hospitalId);
    res.json({ message: "Hospital deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during deleting hospitals: ", err);
  }
};

module.exports.getApproved = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doc = await Doctor.findById(doctorId).populate("hospital");
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { verified: true },
      { runValidators: true }
    );
    res.json(doctor);

    const emailMessage =
      "Your verification is done Successfully. You can now checkout the website. Thankyou for you patience and choosing us :)";
    //sending mail to doctor
    await sendEmail({
      to: doctor.email,
      subject: "Approval Status Update",
      html: emailMessage,
      hospitalName: doc.hospital.name,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during deleting hospitals: ", err);
  }
};

module.exports.disApprove = async (req, res) => {
  const { doctorId } = req.params;
  console.log(doctorId)
  try {
    const doc = await Doctor.findById(doctorId).populate("hospital");
    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { verified: false },
      { runValidators: true }
    );
    res.json(doctor);

    const emailMessage =
      "Due to some reasons, your approval has been rejected. We will notify about your approval very soon. Thankyou for you patience and choosing us :)";
    //sending mail to doctor
    await sendEmail({
      to: doctor.email,
      subject: "Approval Status Update",
      html: emailMessage,
      hospitalName: doc.hospital.name,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during deleting hospitals: ", err);
  }
};

module.exports.updatePharmacyStatusById = async (req, res) => {
  const { pharmacyId } = req.params;
  try {
    const pharmacy = await Pharmacy.findById(pharmacyId).populate("hospital");
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found!!" });
    let emailMessage = "";
    if (pharmacy.verified) {
      pharmacy.verified = false;
      emailMessage =
        "Your approval is got cancelled due to some reasons. Thankyou for your patience and choosing us:)";
    } else {
      pharmacy.verified = true;
      emailMessage =
        "Your approval is veified successfully. Thankyou for your patience and choosing us:)";
    }

    const updatedPharmacy = await pharmacy.save();
    res.json(updatedPharmacy);
    //sending mail to doctor
    await sendEmail({
      to: pharmacy.email,
      subject: "Approval Status Update",
      html: emailMessage,
      hospitalName: pharmacy.hospital.name,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    console.log("Error during updating pharmacy approval status: ", err);
  }
};
