const express = require("express");
const createHttpError = require("http-errors");
const Hospital = require("../models/hospital");
const router = express.Router();

router.param("id", async (req, res, next, id) => {
  const currentHospital = await Hospital.findById(id);
  if (!currentHospital) throw createHttpError(404, "Hospital not exist");
  req.currentHospital = currentHospital;
  next();
});

router.get("/", async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const hospitals = await Hospital.find().skip(offset).limit(limit);
  res.send(hospitals);
});

router.get("/:id", async (req, res) => {
  res.send(req.currentHospital);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  let hospital = new Hospital({ name });
  hospital = await hospital.save();
  res.send(hospital);
});

router.patch("/:id", async (req, res) => {
  const { name } = req.body;
  req.currentHospital.name = name;
  const hospital = await req.currentHospital.save();
  res.send(hospital);
});

router.delete("/:id", async (req, res) => {
  await req.currentHospital.remove();
  res.status(204).send();
});

module.exports = router;
