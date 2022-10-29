const express = require("express");
const authRouter = require("./auth");
const patientRouter = require("./patients");
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
router.use("/patients", patientRouter);

module.exports = router;

/**
 * Admins
 */

/**
 * Hospitals
 */

/**
 * Doctors
 */

/**
 * Appointments
 */
