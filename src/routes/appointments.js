const express = require("express");
const createHttpError = require("http-errors");
const { body } = require("express-validator");
const {
  isPast,
  isFuture,
  addMinutes,
  intervalToDuration,
  formatDuration,
} = require("date-fns");
const Appointment = require("../models/appointment");
const Schedule = require("../models/schedule");
const { validateRequest, requireAuth } = require("../middlewares");
const Doctor = require("../models/doctor");
const router = express.Router();

/**
 * Helpers
 */

const isBookableSchedule = async (id) => {
  const schedule = await Schedule.findById(id);
  if (!schedule) return Promise.reject("Invalid scheduleId");

  if (isPast(schedule.to)) return Promise.reject("Schedule is already over");

  const bookedAppointments = await Appointment.find({
    status: "booking",
    scheduleId: id,
  });
  if (bookedAppointments.length >= schedule.patient_limit)
    return Promise.reject("Patient limit already full");

  return id;
};

const validateAppointment = [body("scheduleId").custom(isBookableSchedule)];

/**
 * Appointments will be done by patients
 * - req.user is available
 */

router.param("id", async (req, res, next, id) => {
  const currentAppointment = await Appointment.findById(id);
  if (!currentAppointment) throw createHttpError(404, "Appointment not exist");
  req.currentAppointment = currentAppointment;
  next();
});

router.get("/", async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const appointments = await Appointment.find({}).skip(offset).limit(limit);
  res.send(appointments);
});

router.get("/:id", async (req, res) => {
  const appointment = req.currentAppointment;
  const schedule = await Schedule.findById(appointment.scheduleId);
  if (!schedule) throw createHttpError(404, "Invalid schedule");

  const doctor = await Doctor.findById(schedule.doctorId);
  if (!doctor) throw createHttpError(404, "Invalid doctor");

  // if valid booking, show approximation time to consult
  if (isFuture(schedule.to) && appointment.status === "booking") {
    const approximate_time_to_consult = calculateApproaximateTime(
      schedule.from,
      doctor.average_consult_minutes,
      appointment.token
    );

    const resObj = appointment.toObject();
    resObj.approximate_time_to_consult = approximate_time_to_consult;
    return res.send(resObj);
  }

  res.send(appointment);
});

router.post(
  "/",
  requireAuth,
  validateRequest(validateAppointment),
  async (req, res) => {
    const { scheduleId } = req.body;
    const patientId = req.user._id;

    const bookedAppointments = await Appointment.find({
      status: "booking",
      scheduleId,
    });
    const token = bookedAppointments.length + 1;

    let appointment = new Appointment({ token, patientId, scheduleId });
    appointment = await appointment.save();
    res.send(appointment);
  }
);

router.patch("/:id/complete", requireAuth, async (req, res) => {
  req.currentAppointment.status = "completed";
  const appointment = await req.currentAppointment.save();
  res.send(appointment);
});

router.patch("/:id/cancel", requireAuth, async (req, res) => {
  req.currentAppointment.status = "cancelled";
  const appointment = await req.currentAppointment.save();
  res.send(appointment);
});

router.delete("/:id", async (req, res) => {
  await req.currentAppointment.remove();
  res.status(204).send();
});

module.exports = router;

/**
 *
 * @param {*} startTime schedule start time
 * @param {*} minPerPatient time taken for a patient by doctor
 * @param {*} index token(index) in booking queue
 */
function calculateApproaximateTime(startDate, minPerPatient, index) {
  const token_start_date = addMinutes(startDate, index * minPerPatient);
  const duration = intervalToDuration({
    start: new Date(),
    end: token_start_date,
  });

  const approximate_time = formatDuration(duration, {
    format: ["years", "months", "weeks", "days", "hours", "minutes"],
    delimiter: ",",
  });

  return approximate_time;
}
