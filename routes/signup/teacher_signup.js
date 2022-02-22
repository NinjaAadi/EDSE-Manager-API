const express = require("express");

const router = express.Router();

//Bring the controller functions for teachers
const {
  addDetail,
  updateDetail,
  getTeacherPassword,
  deleteTeacherDetail,
} = require("../../controllers/teacher/teacher_signup");

//Routes for teachers
router.route("/teacher/addCredentials").post(addDetail);
router.route("/teacher/updateCredentials").put(updateDetail);
router.route("/teacher/getCredentials").get(getTeacherPassword);
router.route("/teacher/deleteCredientials").delete(deleteTeacherDetail);

module.exports = router;
