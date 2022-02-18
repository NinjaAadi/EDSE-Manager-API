const express = require("express");
const router = express.Router();

//Import all the middleware functions
const {
  addTeacherProfile,
  updateTeacherProfile,
  getTeacherProfile,
  deleteTeacherProfile,
} = require("../../controllers/teacher/teacher_profile");

//Routes
router.route("/createProfile").post(addTeacherProfile);
router.route("/updateProfile").post(updateTeacherProfile);
router.route("/getProfile").get(getTeacherProfile);
router.route("/deleteProfile").delete(deleteTeacherProfile);

module.exports = router;
