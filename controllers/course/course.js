const errorHandler = require("../../error/error");
const checkValid = require("../../validators/check_valid_value");
const isValidId = require("../../validators/valid_objectid");
//Import the model
const courseSchema = require("../../models/course/course");


/*
@desc: Add a course
@access: Private
*/
exports.addCourse = async (req, res, next) => {
  try {
    const { name, subjectCode, description } = req.body; //Fetch the details of the course from the body
    const courseObj = { name, subjectCode, description }; //Create the object

    //Validate all the fields
    if (
      checkValid(name) == false ||
      checkValid(subjectCode) == false ||
      checkValid(description) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a course in addCourse function",
        "Invalid course details! Please try again."
      );
    }

    //Insert into the database
    const course = await courseSchema.create(courseObj);

    //Return success
    return res.status(200).json({
      success: true,
      messege: "Course created successfully",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding a course in addCourse function",
      error.code == 11000
        ? "A course with this subject code already exists"
        : "Error adding a course. Please try again!"
    );
  }
};

/*
@desc: Get all courses
@access: Public
*/
exports.getAllCourse = async (req, res, next) => {
  try {
    //Fetch from the db
    const allCourse = await courseSchema.find();

    //return response
    return res.status(200).json({
      success: true,
      data: allCourse,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching all courses in getAllCourse function",
      "Error fetching all courses. Please try again!"
    );
  }
};
/*
@desc: Update a course
@access: Private
*/
exports.updateCourse = async (req, res, next) => {
  try {
    const courseId = req.query.courseId;
    const { name, subjectCode, description } = req.body;
    const courseObj = { name, subjectCode, description };

    //Validate the id
    if (isValidId(courseId) == false || checkValid(courseId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating the course in updateCourse function",
        "Please provide a valid course id"
      );
    }

    //Validate all the fields
    if (
      checkValid(name) == false ||
      checkValid(subjectCode) == false ||
      checkValid(description) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a course in updateCourse function",
        "Invalid course details! Please try again!"
      );
    }

    //Update the field
    const courseToUpdate = await courseSchema.findByIdAndUpdate(
      courseId,
      courseObj
    );
    //If there is no course with this id then return error
    if (courseToUpdate == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a course in updateCourse function",
        "No course with this id is present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      messege: "Course details updated sucessfully",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating course in updateCourse function",
      "Error updating the course. Please try again!"
    );
  }
};

/*
@desc: Delete a course
@access: Private 
*/
exports.deleteCourse = async (req, res, next) => {
  try {
    //Get the id
    const courseId = req.query.courseId;

    //Validate the id
    if (isValidId(courseId) == false || checkValid(courseId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting the course in deleteCourse function",
        "Please provide a valid course id"
      );
    }

    //Delete the course
    const courseToDelete = await courseSchema.findByIdAndDelete(courseId);

    //If there is no course with this id present
    if (courseToDelete == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a course in deleteCourse function",
        "No course with this id is present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      messege: "Course deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting the course in deleteCourse function",
      "Error deleting the course. Please try again!"
    );
  }
};
/*
@desc: Get a course by id
@access: Public
*/
exports.getCourseById = async (req, res, next) => {
  try {
    //Get the id
    const courseId = req.query.courseId;

    //Validate the id
    if (isValidId(courseId) == false || checkValid(courseId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting the course in getCourseById function",
        "Please provide a valid course id"
      );
    }

    //get the course
    const course = await courseSchema.findById(courseId);

    //If there is no course with this id present
    if (course == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a course in getCourseById function",
        "No course with this id is present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting the course in getCourseById function",
      "Error getting the course. Please try again!"
    );
  }
};
