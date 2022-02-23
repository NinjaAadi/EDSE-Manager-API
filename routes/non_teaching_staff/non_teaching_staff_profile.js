const express = require("express");
const router = express.Router();

//Import all the middleware functions
const {
  addNonTeachingStaffProfile,
  updateNonTeachingStaffProfile,
  getNonTeachingStaffProfile,
  deleteNonTeachingStaffProfile,
} = require("../../controllers/non_teaching_staff/non_teaching_staff_profile");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

//Routes
router.route("/createProfile").post(auth, addNonTeachingStaffProfile);
router.route("/updateProfile").put(auth, updateNonTeachingStaffProfile);
router.route("/getProfile").get(getNonTeachingStaffProfile);
router.route("/deleteProfile").delete(auth, deleteNonTeachingStaffProfile);

module.exports = router;
