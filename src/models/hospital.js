const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Hospital = mongoose.model("hospital", HospitalSchema);
module.exports = Hospital;
