const express = require("express");

const router = express.Router();

//Bring the controller functions

const {
  addTimeTable,
  updateTimeTable,
  getTimeTable,
  deleteTimeTable,
} = require("../../controllers/time_table/time_table");

//Routes
router.route("/addTimeTable").post(addTimeTable);
router.route("/updateTimeTable").put(updateTimeTable);
router.route("/getTimeTable").get(getTimeTable);
router.route("/deleteTimeTable").delete(deleteTimeTable);

module.exports = router;
