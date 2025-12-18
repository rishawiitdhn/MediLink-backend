const express = require("express");
const multer = require("multer");
const {storage} = require("../cloudConfigMedicalReport");

const upload = multer({ storage });

const {
  getDoctorById,
  getAllDoctors,
  getAllAppointments,
  addPrescription,
  getDoctorsByHospitalId,
  getAllVerifiedDoctors,
  uploadMedicalReports,
  markCompletedAppointment,
} = require("../controllers/doctorController");
const router = express.Router({ mergeParams: true });

const {isDoctor} = require("../middleware")

router.get("/doctor/all", getAllDoctors);
router.get("/doctor/all/verified", getAllVerifiedDoctors);
router.get("/doctor/hospital/:hospitalId", getDoctorsByHospitalId);

router.post("/doctor/report/:patientId", isDoctor, upload.array('reports', 10), uploadMedicalReports);

router.get("/doctor/:doctorId", getDoctorById);
router.get("/doctor/appointments/:doctorId", isDoctor, getAllAppointments);
router.post(
  "/doctor/prescription",
  isDoctor,
  addPrescription
);
router.post("/doctor/completedAppointment", isDoctor, markCompletedAppointment);




module.exports = router;
