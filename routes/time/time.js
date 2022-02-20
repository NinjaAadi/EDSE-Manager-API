const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addTime,
  getAllTime,
  updateTime,
  deleteTime,
} = require("../../controllers/time/time");
//Routes
router.route("/addTime").post(addTime);
router.route("/getAllTime").get(getAllTime);
router.route("/updateTime").put(updateTime);
router.route("/deleteTime").delete(deleteTime);

module.exports = router;
