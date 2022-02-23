const express = require("express");

const router = express.Router();

//Bring the controller function
const {
  createClass,
  updateTeacher,
  updateClassName,
  deleteClass,
  getClassByTeacherId,
  addStudentToClass,
  deleteStudentFromClass,
} = require("../../controllers/class/class");

//Routes
router.route("/createClass").post(createClass);
router.route("/updateTeacher").put(updateTeacher);
router.route("/updateClassName").put(updateClassName);
router.route("/deleteClass").delete(deleteClass);
router.route("/getClass").get(getClassByTeacherId);
router.route("/addStudent").post(addStudentToClass);
router.route("/deleteStudent").delete(deleteStudentFromClass);

module.exports = router;
