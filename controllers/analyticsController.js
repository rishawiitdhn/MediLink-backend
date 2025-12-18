const Appointment = require("../models/appointmentModel");
const mongoose = require("mongoose");
const Doctor = require("../models/doctorModel");
const Prescription = require("../models/prescriptionModel");

module.exports.appointmentsPerDay = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "Asia/Kolkata" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error during getting appointments per day: ", err);
    res.status(500).json({message: "Server Error"});
  }
};

module.exports.doctorBySpeciallization = async (req, res) => {
  try{
    const data = await Doctor.aggregate([
      {
        $group: {
          _id: "$specialisation",
          count: {$sum: 1}
        }
      }
    ])
    res.json(data);
  }catch(err){
    console.error("Error during getting doctor by speciallization: ", err);
    res.status(500).json({message: "Server Error"});
  }
}

exports.prescriptionsByHospital = async (req, res) => {
  const data = await Prescription.aggregate([
    { $match: { status: "dispensed" } },
    {
      $group: {
        _id: "$hospital",
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "hospitals",
        localField: "_id",
        foreignField: "_id",
        as: "hospital"
      }
    },
    { $unwind: "$hospital" },
    {
      $project: {
        hospitalName: "$hospital.name",
        count: 1
      }
    }
  ]);

  res.json(data);
};

