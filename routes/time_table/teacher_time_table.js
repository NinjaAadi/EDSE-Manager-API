const express = require("express");

const router = express.Router();

//Bring the controller functions

const {
  addTimeTable,
  updateTimeTable,
  getTimeTable,
  deleteTimeTable,
  relateTimeTable,
  getTimeTableForTeacher,
} = require("../../controllers/time_table/teacher_time_table");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

//Routes
router.route("/addTimeTable").post(addTimeTable);
router.route("/updateTimeTable").put(auth, updateTimeTable);
router.route("/getTimeTable").get(getTimeTable);
router.route("/deleteTimeTable").delete(auth, deleteTimeTable);
router.route("/relateTimeTable").post(relateTimeTable);
router.route("/getTimeTableForTeacher").get(getTimeTableForTeacher);

module.exports = router;
