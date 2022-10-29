const express = require("express");
const createHttpError = require("http-errors");
const { body } = require("express-validator");
const { areIntervalsOverlapping, isValid, parseISO } = require("date-fns");
const Schedule = require("../models/schedule");
const Hospital = require("../models/hospital");
const { validateRequest } = require("../middlewares");
const router = express.Router();

/**
 * Internal helpers
 */
const isNotOverlap = async (value, { req }) => {
  const { currentDoctor } = req;
  const { from, to } = req.body;
  if (!from || !to) return Promise.reject("Invalid schedule range");

  // parse ISO to Date here
  const parsedFrom = isValid(from) ? from : parseISO(from);
  const parsedTo = isValid(to) ? to : parseISO(to);

  const oldSchedules = await Schedule.find({ doctorId: currentDoctor.id });

  const overlapped = oldSchedules.filter((schedule) =>
    areIntervalsOverlapping(
      { start: parsedFrom, end: parsedTo },
      { start: schedule.from, end: schedule.to }
    )
  );

  if (overlapped.length > 0) return Promise.reject("Overlapped schedules");
  return value;
};

const isValidHospital = async (value) => {
  const hospital = await Hospital.findById(value);
  if (!hospital) return Promise.reject("Invalid hospitalId");
  return value;
};
const validateSchedule = [
  body("from").isISO8601().custom(isNotOverlap).customSanitizer(parseISO),
  body("to").isISO8601().custom(isNotOverlap).customSanitizer(parseISO),
  body("patient_limit").isInt(),
  body("hospitalId").custom(isValidHospital),
];

/**
 * - req.currentDoctor is available to be used
 */

router.param("scheduleId", async (req, res, next, id) => {
  const currentSchedule = await Schedule.findById(id);
  if (!currentSchedule) throw createHttpError(404, "Schedule not exist");
  req.currentSchedule = currentSchedule;
  next();
});

router.get("/", async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const schedules = await Schedule.find({ doctorId: req.currentDoctor.id })
    .skip(offset)
    .limit(limit);
  res.send(schedules);
});

router.get("/:scheduleId", async (req, res) => {
  res.send(req.currentSchedule);
});

router.post("/", validateRequest(validateSchedule), async (req, res) => {
  const { from, to, patient_limit, hospitalId } = req.body;
  const doctorId = req.currentDoctor.id;
  let schedule = new Schedule({
    from,
    to,
    patient_limit,
    hospitalId,
    doctorId,
  });
  schedule = await schedule.save();
  res.send(schedule);
});

router.patch(
  "/:scheduleId",
  validateRequest(validateSchedule),
  async (req, res) => {
    const { from, to, patient_limit, hospitalId } = req.body;
    let schedule = req.currentSchedule;
    schedule.from = from;
    schedule.to = to;
    schedule.patient_limit = patient_limit;
    schedule.hospitalId = hospitalId;
    schedule = await req.currentSchedule.save();
    res.send(schedule);
  }
);

router.delete("/:scheduleId", async (req, res) => {
  await req.currentSchedule.remove();
  res.status(204).send();
});

module.exports = router;
