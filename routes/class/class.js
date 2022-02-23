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

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");
//Routes
router.route("/createClass").post(auth, createClass);
router.route("/updateTeacher").put(auth, updateTeacher);
router.route("/updateClassName").put(auth, updateClassName);
router.route("/deleteClass").delete(auth, deleteClass);
router.route("/getClass").get(getClassByTeacherId);
router.route("/addStudent").post(auth, addStudentToClass);
router.route("/deleteStudent").delete(auth, deleteStudentFromClass);

module.exports = router;
