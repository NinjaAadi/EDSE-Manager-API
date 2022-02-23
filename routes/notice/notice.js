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

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

//Routes
router.route("/addNotice").post(auth, addNotice);
router.route("/getAllNotice").get(getAllNotice);
router.route("/getNotice").get(getNotice);
router.route("/deleteNotice").delete(auth, deleteNotice);
router.route("/updateNotice").put(auth, updateNotice);
module.exports = router;
