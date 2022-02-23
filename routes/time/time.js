const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addTime,
  getAllTime,
  updateTime,
  deleteTime,
} = require("../../controllers/time/time");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");
//Routes
router.route("/addTime").post(auth, addTime);
router.route("/getAllTime").get(getAllTime);
router.route("/updateTime").put(auth, updateTime);
router.route("/deleteTime").delete(auth, deleteTime);

module.exports = router;
