const express = require("express");
const router = express.Router({mergeParams: true});
const doctorRoutes = require("./doctorRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const patientRoutes = require("./patientRoutes");
const pharmacyRoutes = require("./pharmacyRoutes");

router.use("/", doctorRoutes);
router.use("/", authRoutes);
router.use("/", adminRoutes);
router.use("/", patientRoutes);
router.use("/", pharmacyRoutes);

router.get("/", (req, res) => {
    res.send("Hello");
})

module.exports = router;