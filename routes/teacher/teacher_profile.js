const express = require("express");
const router = express.Router();

//Import all the middleware functions
const {
  addTeacherProfile,
  updateTeacherProfile,
  getTeacherProfile,
  deleteTeacherProfile,
} = require("../../controllers/teacher/teacher_profile");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

//Routes
router.route("/createProfile").post(auth, addTeacherProfile);
router.route("/updateProfile").put(auth, updateTeacherProfile);
router.route("/getProfile").get(getTeacherProfile);
router.route("/deleteProfile").delete(auth, deleteTeacherProfile);

module.exports = router;
