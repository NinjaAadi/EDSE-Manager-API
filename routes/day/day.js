const express = require("express");

const router = express.Router();

//Bring the controller functions
const { addDay, deleteDay, getAllDays } = require("../../controllers/day/day");

//Routes
router.route("/addDay").post(addDay);
router.route("/deleteDay").delete(deleteDay);
router.route("/getAllDays").get(getAllDays);
module.exports = router;
