const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  average_consult_minutes: {
    type: Number,
    required: true,
  },
});

const Doctor = mongoose.model("doctor", DoctorSchema);
module.exports = Doctor;
