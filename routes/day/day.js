const express = require("express");

const router = express.Router();

//Bring the controller functions
const { addDay, deleteDay, getAllDays } = require("../../controllers/day/day");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

//Routes
router.route("/addDay").post(auth, addDay);
router.route("/deleteDay").delete(auth, deleteDay);
router.route("/getAllDays").get(getAllDays);
module.exports = router;
