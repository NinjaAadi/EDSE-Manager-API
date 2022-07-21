const express = require("express");

const router = express.Router();
//Import the controller functions
const {
  addCourse,
  getAllCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
} = require("../../controllers/course/course");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

router.route("/addCourse").post(addCourse);
router.route("/getAllCourse").get(getAllCourse);
router.route("/updateCourse").put(auth, updateCourse);
router.route("/deleteCourse").delete(auth, deleteCourse);
router.route("/getCourse").get(getCourseById);

module.exports = router;
