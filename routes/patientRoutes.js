const express = require("express");
const {
  bookAppointment,
  getAllAppointments,
  getAllPatients,
  getPatientById,
  deleteAppointment,
  getPrescriptionByPatientId,
} = require("../controllers/patientController");
const router = express.Router({ mergeParams: true });
const {isPatient} = require("../middleware");

router.get("/patient/all", getAllPatients);
router.get("/patient/:patientId", getPatientById);
router.get("/patient/appointments/:patientId", getAllAppointments);
router.post(
  "/patient/appointment/:patientId/:doctorId/:hospitalId", isPatient,
  bookAppointment
);

router.get("/patient/prescriptions/:patientId", getPrescriptionByPatientId);
router.delete("/patient/appointment/:appointmentId", isPatient, deleteAppointment);


module.exports = router;
