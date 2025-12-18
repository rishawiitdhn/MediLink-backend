const mongoose = require("mongoose");
const Patient = require("./patientModel");
const Doctor = require("./doctorModel");

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
        required: true,
    },
    hospital: {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isDone: {
        type: Boolean,
        default: false
    }

})

AppointmentSchema.post("findOneAndDelete", async (appointment) => {
    if(appointment){
        await Patient.findByIdAndUpdate(appointment.patient, {$pull: {appointments: appointment._id}});
        await Doctor.findByIdAndUpdate(appointment.doctor, {$pull: {appointments: appointment._id}});
    }
    else console.error("Appointment not found!!");
})

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;