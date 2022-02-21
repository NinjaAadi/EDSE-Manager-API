const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { isValid } = require("../../validators/check_valid_value");
const mongoose = require("mongoose");
//Bring the student schema
const studentSchema = require("../../models/student/student_profile");
//Bring the teacher schema
const teacherSchema = require("../../models/teacher/teacher_profile");
//Bring the review schema
const reviewSchema = require("../../models/review/review");

/*
@desc: Add a review for a student
@access: Private
*/
exports.addReview = async (req, res, next) => {
  try {
    //Fetch the student id from the url
    const studentId = req.query.studentId;

    //Get the review and the teacher id
    const { teacherId, comment } = req.body;

    //Validate the teacher id
    if (
      isValidId(teacherId) == false ||
      (await teacherSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a review in addReview function",
        "Please provide a valid teacher id"
      );
    }

    //Validate the student id
    if (
      isValid(studentId) == false ||
      (await studentSchema.findOne({ _id: studentId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a review in addReview function",
        "Please provide a valid student id"
      );
    }

    //Validate the comment
    if (isValid(comment) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a review in addReview function",
        "Please provide a valid comment"
      );
    }

    //Add the comment in the database
    const review = await reviewSchema.create({
      student: mongoose.Types.ObjectId(studentId),
      teacher: mongoose.Types.ObjectId(teacherId),
      comment: comment,
    });
    return res.status(200).json({
      success: true,
      messege: "Review provided successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding a review in addReview function",
      "Error adding a review"
    );
  }
};

/*
@desc: Update a review for a student
@access: Private
*/

exports.updateReview = async (req, res, next) => {
  try {
    //Fetch the review id from the url
    const reviewId = req.query.reviewId;

    //Get the review and the teacher id
    const { teacherId, comment } = req.body;

    //Validate the teacher id
    if (
      isValidId(teacherId) == false ||
      (await teacherSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a review in updateReview function",
        "Please provide a valid teacher id"
      );
    }

    //Validate the review id
    if (isValid(reviewId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a review in updateReview function",
        "Please provide a valid review id"
      );
    }

    //Validate the comment
    if (isValid(comment) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a review in updateReview function",
        "Please provide a valid comment"
      );
    }

    //Bring the review
    const review = await reviewSchema.findOne({ _id: reviewId });

    if (review == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a review in updateReview function",
        "There is no review with this id!"
      );
    }

    //Check if the teacher id given matches the review teacher id
    console.log(review.teacher, teacherId);
    if (review.teacher != teacherId) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a review in updateReview function",
        "The teacher id does not match with the review id"
      );
    }
    //Add the comment in the database
    review.comment = comment;
    await review.save();

    return res.status(200).json({
      success: true,
      messege: "Review updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating a review in updateReview function",
      "Error updating a review"
    );
  }
};

/*
@desc: Get all review for a student
@access: Private
*/

exports.getReview = async (req, res, next) => {
  try {
    //Fetch the student id from the url
    const studentId = req.query.studentId;

    //Validate the student id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching reviews in getReview function",
        "Please provide a valid student id"
      );
    }

    //Get the populated review
    const reviews = await reviewSchema
      .find({ student: studentId })
      .populate("student", { _id: 1, fullName: 1 })
      .populate("teacher", { _id: 1, fullName: 1 });
    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching a review in getReview function",
      "Error fetching reviews"
    );
  }
};
/* 
@desc: Delete a review
@access: Private
*/

exports.deleteReview = async (req, res, next) => {
  try {
    //Bring the reviewId from the URL
    const reviewId = req.query.reviewId;

    //Bring the teacherId from the URL
    const teacherId = req.query.teacherId;

    //Validate the reviewId and the teacherId
    if (isValid(reviewId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a review in deleteReview function",
        "Please provide a valid review id"
      );
    }
    //Validate the studentId and the teacherId
    if (isValid(teacherId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a review in deleteReview function",
        "Please provide a valid teacher id"
      );
    }

    const review = await reviewSchema.findOne({ _id: reviewId });

    //If there is no review with this is
    if (review == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error deleting a review in deleteReview function",
        "No review present with this id!"
      );
    }

    //Match the teacher id with the review id
    if (review.teacher != teacherId) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a review in deleteReview function",
        "The teacher id does not match with the review teacher id"
      );
    }

    //Delete the review
    await reviewSchema.findOneAndDelete({ _id: reviewId });

    return res.status(200).json({
      success: true,
      messege: "Review deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting a review in deleteReview funtion",
      "Error deleting a review!"
    );
  }
};
