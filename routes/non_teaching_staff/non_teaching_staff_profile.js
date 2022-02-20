const express = require("express");
const router = express.Router();

//Import all the middleware functions
const {
  addNonTeachingStaffProfile,
  updateNonTeachingStaffProfile,
  getNonTeachingStaffProfile,
  deleteNonTeachingStaffProfile,
} = require("../../controllers/non_teaching_staff/non_teaching_staff_profile");

//Routes
router.route("/createProfile").post(addNonTeachingStaffProfile);
router.route("/updateProfile").put(updateNonTeachingStaffProfile);
router.route("/getProfile").get(getNonTeachingStaffProfile);
router.route("/deleteProfile").delete(deleteNonTeachingStaffProfile);

module.exports = router;
