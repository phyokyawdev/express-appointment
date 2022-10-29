const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  token: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["booking", "completed", "cancelled"],
    default: "booking",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Appointment = mongoose.model("appointment", AppointmentSchema);
module.exports = Appointment;
