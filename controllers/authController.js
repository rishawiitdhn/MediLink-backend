const mongoose = require("mongoose");
const Doctor = require("../models/doctorModel.js");
const Pharmacy = require("../models/pharmacyModel.js");
const Patient = require("../models/patientModel.js");
const Admin = require("../models/adminModel.js");
const Hospital = require("../models/hospitalModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const models = {
  doctor: Doctor,
  pharmacy: Pharmacy,
  patient: Patient,
  admin: Admin,
};

const adminCodes = process.env.ADMIN_CODES.split(",");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password, contact, specialisation, role, hospitalName, adminCode } = req.body;

    if(!role){
      return res.status(404).json({message: "role not found"});
    }

     if (role === "admin") {
      if (!adminCode) {
        return res.status(401).json({ message: "Admin code required" });
      }

      const isValid = adminCodes.includes(adminCode);
      if (!isValid) {
        return res.status(401).json({ message: "Not authorised!" });
      }
    }

    const existing = await models[role].findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new models[role]({
      name,
      email,
      password: hashedPassword,
      contact,
      specialisation,
    });

    if(hospitalName){
      const hospital = await Hospital.findOne({name: hospitalName});
      newUser.hospital = hospital._id;
    }

    newUser.adminCode = adminCode;

    const result = await newUser.save();

    // console.log(result);
    //saving doctors into Hospitals:
    if(hospitalName){
      const hospital = await Hospital.findOne({name: hospitalName});
      if(role==="doctor"){
        hospital.doctors.push(result._id);
      hospital.departments.push(result.specialisation);
      }
      else{
        hospital.pharmacies.push(result._id);
        newUser.hospital = hospital._id;
      }
      await newUser.save();
      const res1 = await hospital.save();
    }

    const token = jwt.sign(
      { id: result._id, role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.json({ token, userId: result._id, role });
  } catch (err) {
    res.status(500).json({message: "server error"});
    console.log("Error registering user", err);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password, role, adminCode } = req.body;

    const user = await models[role].findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if(adminCode){
      if(user.adminCode!==adminCode){
        return res.status(400).json({ message: "Not authorised!" });
      }
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.json({ token, userId: user._id, role });
  } catch (err) {
    res.status(500).json({message: "server error"});
    console.log("Error Logging user", err);
  }
};

module.exports.getuserProfile = async (req, res) => {
  const { userId, role } = req.params;
  try {
    const result = await models[role].findById(userId);
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({ result });
  } catch (err) {
    res.status(500).json({message: "server error"});
    console.log("Error fetching user profile", err);
  }
};

module.exports.updateUserProfile = async (req, res) => {
  const { userId, role } = req.params;
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await models[role].findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    const result = await user.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({message: "server error"});
    console.log("Error updating user profile", err);
  }
};

module.exports.deleteUserProfile = async (req, res) => {
  const { userId, role } = req.params;
  try {
    const user = await models[role].findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await models[role].findByIdAndDelete(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({message: "server error"});
    console.log("Error deleting user profile", err);
  }
};
