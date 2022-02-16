const express = require("express");
const router = express.Router();

//Import all the middleware functions
const { test } = require("../../controllers/student_profile/student_profile");

//Routes
router.route("/createprofile").post(test);

module.exports = router;
