const express = require("express");
const authRouter = require("./auth");
const patientsRouter = require("./patients");
const doctorsRouter = require("./doctors");
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

module.exports = router;

/**
 * Admins
 */

/**
 * Hospitals
 */

/**
 * Appointments
 */
