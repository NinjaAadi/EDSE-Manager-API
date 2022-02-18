const express = require("express");
const router = express.Router();

//Import all the middleware functions
const {
  addStudentProfile,
  updateStudentProfile,
  getStudentProfile,
  deleteStudentProfile,
} = require("../../controllers/student/student_profile");

//Routes
router.route("/createProfile").post(addStudentProfile);
router.route("/updateProfile").post(updateStudentProfile);
router.route("/getProfile").get(getStudentProfile);
router.route("/deleteProfile").delete(deleteStudentProfile);

module.exports = router;
