const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
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
  },
  contact: {
    type: Number,
    required: true,
  },
  prescriptions: [
    {
      default: [],
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  ],
  verified:{
    type: Boolean,
    default: false,
  }
});

const Pharmacy = mongoose.model("Pharmacy", PharmacySchema);
module.exports = Pharmacy;
