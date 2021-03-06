const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addAttendance,
  deleteAttendance,
} = require("../../controllers/attendence/attendence");

//Bring the authorization middleware function
const auth = require("../../middlewares/admin_teacher_auth");
//Routes
router.route("/setAttendance").post(auth, addAttendance);
router.route("/deleteAttendance").post(auth, deleteAttendance);
module.exports = router;
