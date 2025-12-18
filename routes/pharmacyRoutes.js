const express = require("express");
const {
  getAllPrescriptions,
  updateStatusToDispensed,
  getAllPharmacies,
  getPharmaciesByHospitalId,
  getPrescriptionsByPharmacyId,
  getPharmacyById,
} = require("../controllers/pharmacyController");
const router = express.Router({ mergeParams: true });
const {isPharmacy} = require("../middleware");

router.get("/pharmacy/prescriptions", getAllPrescriptions);
router.get("/pharmacy/all", getAllPharmacies);
router.patch("/pharmacy/:prescriptionId", isPharmacy, updateStatusToDispensed);
router.get("/pharmacy/:hospitalId", getPharmaciesByHospitalId);
router.get("/pharmacy/pharmacy/:pharmacyId", getPharmacyById);
router.get("/pharmacy/prescriptions/:pharmacyId", isPharmacy, getPrescriptionsByPharmacyId);

module.exports = router;
