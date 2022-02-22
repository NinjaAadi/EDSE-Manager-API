const express = require("express");
const router = express.Router();

//Bring the controller function
const { teacherLogin } = require("../../controllers/login/teacher");
//Route
router.route("/teacher").get(teacherLogin);
module.exports = router;
