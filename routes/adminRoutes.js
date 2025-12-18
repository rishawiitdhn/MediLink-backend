const express = require("express");
const {appointmentsPerDay, doctorBySpeciallization, prescriptionsByHospital} = require("../controllers/analyticsController");
const {
  addHospitals,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  getApproved,
  disApprove,
  updatePharmacyStatusById,
  getHospitalByName,
} = require("../controllers/adminController");
const { getAllPrescriptions } = require("../controllers/pharmacyController");
const { isAdmin } = require("../middleware");
const router = express.Router({ mergeParams: true });

const multer = require("multer");
const {storage} = require("../cloudConfigHospital");

const upload = multer({ storage });

router.post("/admin/hospitals", isAdmin, addHospitals);
router.get("/admin/hospitals", getAllHospitals);
router.get("/admin/hospitals/:hospitalId", getHospitalById);
router.get("/admin/hospital/:hospitalName", getHospitalByName);
router.patch("/admin/hospitals/:hospitalId", isAdmin, upload.single("hospital_image"),updateHospital);
router.delete("/admin/hospitals/:hospitalId", isAdmin, deleteHospital);

router.patch("/admin/doctor/approve/:doctorId", isAdmin, getApproved);
router.patch("/admin/doctor/disapprove/:doctorId", isAdmin, disApprove);

router.patch("/admin/pharmacy/:pharmacyId",isAdmin, updatePharmacyStatusById);
router.patch("/admin/prescriptions", getAllPrescriptions);

router.get("/admin/analytics/appointmentsperday", appointmentsPerDay);
router.get("/admin/analytics/speciallisation", doctorBySpeciallization);
router.get("/admin/analytics/prescriptions", prescriptionsByHospital);


module.exports = router;
