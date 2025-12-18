const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
      },
      hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital", 
        required: true,   
      },
      specialisation: {
        type: String,
        required: true,
      },
      contact: {
        type: Number,
        required: true,
      },

      appointments: [
        {
          default : [],
          type: mongoose.Schema.Types.ObjectId,
          ref: "Appointment",
        },
      ],
      verified: {
        type: Boolean,
        default: false,
      }
})

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;