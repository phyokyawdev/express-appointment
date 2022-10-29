const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  patient_limit: {
    type: Number,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Schedule = mongoose.model("schedule", ScheduleSchema);
module.exports = Schedule;
