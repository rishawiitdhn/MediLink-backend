const mongoose = require("mongoose");
const Hospital = require("./hospitalModel");
const Appointment = require("./appointmentModel");

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      adminCode: {
        type: String,
        required: true,
      }
})

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;