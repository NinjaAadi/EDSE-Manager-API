const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addReview,
  updateReview,
  getReview,
  deleteReview,
} = require("../../controllers/review/review");

//Bring the authorization functions
const auth = require("../../middlewares/admin_teacher_auth");
//Routes

router.route("/addReview").post(auth, addReview);
router.route("/updateReview").put(auth, updateReview);
router.route("/getReviews").get(auth, getReview);
router.route("/deleteReview").delete(auth, deleteReview);

module.exports = router;
