const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addNotice,
  getAllNotice,
  getNotice,
  deleteNotice,
  updateNotice,
} = require("../../controllers/notice/notice");
const { update } = require("../../models/notice/notice");


//Routes
router.route("/addNotice").post(addNotice);
router.route("/getAllNotice").get(getAllNotice);
router.route("/getNotice").get(getNotice);
router.route("/deleteNotice").delete(deleteNotice);
router.route("/updateNotice").post(updateNotice);
module.exports = router;
