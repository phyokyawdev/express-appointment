const express = require("express");
const createHttpError = require("http-errors");
const Patient = require("../models/user");
const router = express.Router();

router.param("id", async (req, res, next, id) => {
  const currentPatient = await Patient.find({ _id: id, role: "patient" });
  if (!currentPatient) throw createHttpError(404, "Patient not exist");
  req.currentPatient = currentPatient;
  next();
});

router.get("/", async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const patients = await Patient.find({ role: "patient" })
    .skip(offset)
    .limit(limit);
  res.send(patients);
});

router.get("/:id", async (req, res) => {
  res.send(req.currentPatient);
});

router.post("/", async (req, res) => {
  const { email, name } = req.body;
  let patient = new Patient({ email, name });
  patient = await patient.save();
  res.send(patient);
});

router.patch("/:id", async (req, res) => {
  const { email, name } = req.body;
  req.currentPatient.email = email;
  req.currentPatient.name = name;
  const patient = await req.currentPatient.save();
  res.send(patient);
});

router.delete("/:id", async (req, res) => {
  await req.currentPatient.remove();
  res.status(204).send();
});

module.exports = router;
