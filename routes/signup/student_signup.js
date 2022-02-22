const express = require("express");

const router = express.Router();

//Bring the controller functions for students
const {
  addDetail,
  updateDetail,
  getStudentPassword,
  deleteStudentDetail,
} = require("../../controllers/student/student_signup");

//Routes for students
router.route("/student/addCredentials").post(addDetail);
router.route("/student/updateCredentials").put(updateDetail);
router.route("/student/getCredentials").get(getStudentPassword);
router.route("/student/deleteCredientials").delete(deleteStudentDetail);

module.exports = router;
