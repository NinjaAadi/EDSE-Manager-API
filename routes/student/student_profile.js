const express = require("express");
const router = express.Router();

//Import all the middleware functions
const {
  addStudentProfile,
  updateStudentProfile,
  getStudentProfile,
  deleteStudentProfile,
} = require("../../controllers/student/student_profile");
//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");
//Routes
router.route("/createProfile").post(auth, addStudentProfile);
router.route("/updateProfile").put(auth, updateStudentProfile);
router.route("/getProfile").get(getStudentProfile);
router.route("/deleteProfile").delete(auth, deleteStudentProfile);

module.exports = router;
