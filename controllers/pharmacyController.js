const mongoose = require("mongoose");
const Prescription = require("../models/prescriptionModel");
const Patient = require("../models/patientModel");
const Pharmacy = require("../models/pharmacyModel");
const Hospital = require("../models/hospitalModel");
const sendEmail = require("../utils/sendEmailConfig");

module.exports.getPharmacyById = async (req, res) => {
  const { pharmacyId } = req.params;
  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found!" });
    }
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error fetching prescriptions: ", err);
  }
};

module.exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({});
    if (prescriptions.length == 0) {
      return res.json({ message: "NO prescriptions" });
    }
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error fetching prescriptions: ", err);
  }
};

module.exports.getPrescriptionsByPharmacyId = async (req, res) => {
  const { pharmacyId } = req.params;
  try {
    const prescriptions = await Prescription.find({ pharmacy: pharmacyId })
      .populate("doctor")
      .populate("hospital")
      .populate("patient")
      .sort({ issuedDate: -1 });
    if (prescriptions.length == 0) {
      return res.json({ message: "NO prescriptions for this pharmacy" });
    }
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error fetching prescriptions: ", err);
  }
};

module.exports.updateStatusToDispensed = async (req, res) => {
  const { prescriptionId } = req.params;
  try {
    console.log(prescriptionId)
    const prescription = await Prescription.findById(prescriptionId)
      .populate("patient")
      .populate("hospital");
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    let emailMessage = "";
    if (prescription.status === "dispensed") {
      prescription.status = "pending";
      emailMessage =
        "Due to some reason, your medicines are not dispensed till now. It will dispense soon. Sorry for inconvenience caused and thankyou for your patience. Reply to this mail if you have any concern. ThankYou for choosing us:)";
    } else {
      prescription.status = "dispensed";
      emailMessage =
        "Your medicines have been successfully dispensed. Thank you for choosing us:)";
    }

    const presc = await prescription.save();
    res.json(presc);

    await sendEmail({
      to: prescription.patient.email,
      subject: "Prescription Status Update",
      html: emailMessage,
      hospitalName: prescription.hospital.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during updating prescription status: ", err);
  }
};

module.exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({}).populate("hospital");
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
    console.error("Error during fetching pharmacies details: ", err);
  }
};

module.exports.getPharmaciesByHospitalId = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const hospital = await Hospital.findById(hospitalId).populate("pharmacies");
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found!" });
    }
    const pharmacies = hospital.pharmacies;
    // console.log(pharmacies.length)
    if (pharmacies.length === 0) {
      return res
        .status(404)
        .json({ message: "No pharmacies present in this hospital!" });
    }
    res.json(pharmacies);
  } catch (err) {
    console.error("Error during fetching hospital pharmacies: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};
