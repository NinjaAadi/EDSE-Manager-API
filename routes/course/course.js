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

router.route("/addCourse").post(addCourse);
router.route("/getAllCourse").get(getAllCourse);
router.route("/updateCourse").post(updateCourse);
router.route("/deleteCourse").delete(deleteCourse);
router.route("/getCourse").get(getCourseById);

module.exports = router;
