const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addAttendance,
  deleteAttendance,
} = require("../../controllers/attendence/attendence");
//Routes
router.route("/setAttendance").post(addAttendance);
router.route("/deleteAttendance").post(deleteAttendance);
module.exports = router;
