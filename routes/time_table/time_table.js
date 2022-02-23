const express = require("express");

const router = express.Router();

//Bring the controller functions

const {
  addTimeTable,
  updateTimeTable,
  getTimeTable,
  deleteTimeTable,
} = require("../../controllers/time_table/time_table");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

//Routes
router.route("/addTimeTable").post(auth, addTimeTable);
router.route("/updateTimeTable").put(auth, updateTimeTable);
router.route("/getTimeTable").get(getTimeTable);
router.route("/deleteTimeTable").delete(auth, deleteTimeTable);

module.exports = router;
