const express = require("express");
const router = express.Router();

//Bring the controller function
const {
  nonTeachingStaffLogin,
} = require("../../controllers/login/non_teaching_staff");
//Route
router.route("/nonTeachingStaff").get(nonTeachingStaffLogin);
module.exports = router;
