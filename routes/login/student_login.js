const express = require("express");
const router = express.Router();

//Bring the controller function
const { studentLogin } = require("../../controllers/login/student");
//Route
router.route("/student").get(studentLogin);
module.exports = router;
