const express = require("express");

const router = express.Router();

//Bring the controller functions
const {
  addReview,
  updateReview,
  getReview,
  deleteReview,
} = require("../../controllers/review/review");
//Routes
router.route("/addReview").post(addReview);
router.route("/updateReview").put(updateReview);
router.route("/getReviews").get(getReview);
router.route("/deleteReview").delete(deleteReview);

module.exports = router;
