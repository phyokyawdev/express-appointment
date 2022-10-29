const express = require("express");
const authRouter = require("./auth");
const patientsRouter = require("./patients");
const doctorsRouter = require("./doctors");
const hospitalsRouter = require("./hospitals");
const appointmentsRouter = require("./appointments");
const router = express.Router();

/**
 * Auth for user(Admins)
 * ====
 * use passport-jwt with bearer token
 *
 * /register
 * /login
 * /profile
 */
router.use("/auth", authRouter);

/**
 * Patients
 */
router.use("/patients", patientsRouter);

/**
 * Doctors
 */
router.use("/doctors", doctorsRouter);

/**
 * Hospitals
 */
router.use("/hospitals", hospitalsRouter);

/**
 * Appointments
 */
router.use("/appointments", appointmentsRouter);

module.exports = router;

/**
 * Admins
 */
