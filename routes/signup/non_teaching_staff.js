const express = require("express");

const router = express.Router();

//Bring the controller functions for nonTeachingStaff
const {
  addDetail,
  updateDetail,
  getNonTeachingStaffPassword,
  deleteNonTeachingStaffDetail,
} = require("../../controllers/non_teaching_staff/non_teaching_staff_signup");

//Routes for nonTeachingStaff
router.route("/nonTeachingStaff/addCredentials").post(addDetail);
router.route("/nonTeachingStaff/updateCredentials").put(updateDetail);
router
  .route("/nonTeachingStaff/getCredentials")
  .get(getNonTeachingStaffPassword);
router
  .route("/nonTeachingStaff/deleteCredientials")
  .delete(deleteNonTeachingStaffDetail);

module.exports = router;
