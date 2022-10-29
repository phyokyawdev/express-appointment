const express = require("express");
const createHttpError = require("http-errors");
const Doctor = require("../models/doctor");
const doctorsSchedulesRouter = require("./schedules");
const router = express.Router();

router.param("id", async (req, res, next, id) => {
  const currentDoctor = await Doctor.findById(id);
  if (!currentDoctor) throw createHttpError(404, "Doctor not exist");
  req.currentDoctor = currentDoctor;
  next();
});

router.get("/", async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const doctors = await Doctor.find().skip(offset).limit(limit);
  res.send(doctors);
});

router.get("/:id", async (req, res) => {
  res.send(req.currentDoctor);
});

router.post("/", async (req, res) => {
  const { name, average_consult_minutes } = req.body;
  let doctor = new Doctor({ name, average_consult_minutes });
  doctor = await doctor.save();
  res.send(doctor);
});

router.patch("/:id", async (req, res) => {
  const { name, average_consult_minutes } = req.body;
  req.currentDoctor.name = name;
  req.currentDoctor.average_consult_minutes = average_consult_minutes;
  const doctor = await req.currentDoctor.save();
  res.send(doctor);
});

router.delete("/:id", async (req, res) => {
  await req.currentDoctor.remove();
  res.status(204).send();
});

/**
 * Doctor's Schedule
 * - req.currentDoctor will be available inside doctorsSchedulesRouter
 */
router.use("/:id/schedules", doctorsSchedulesRouter);

module.exports = router;
