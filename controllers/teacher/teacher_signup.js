const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { isValid } = require("../../validators/check_valid_value");
const { encrypt, decrypt } = require("../../helper/encrypt_decrypt");

//Bring the teacher schema
const teacherSignUpSchema = require("../../models/teacher/teacher_signup");
//Bring the teacher profile schema
const teacherProfileSchema = require("../../models/teacher/teacher_profile");

/*
@desc: Add details of signup for teacher
@access: Private
*/
exports.addDetail = async (req, res, next) => {
  try {
    //Get the id from the url
    const teacherId = req.query.teacherId;

    //Get the password from the body
    const password = req.body.password;

    //Validate the id
    if (
      isValidId(teacherId) == false ||
      (await teacherProfileSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding details of signup for teacher in addDetail function",
        "Please provide a valid teacher id!"
      );
    }

    //Validate the password
    if (isValid(password, 6) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding details of signup for teacher in addDetail function",
        "Password should be of minimum 6 characters!"
      );
    }

    //Encrypt the password
    const encryptedPassword = encrypt(password);

    //Save it into the database
    await teacherSignUpSchema.create({
      teacherId: teacherId,
      password: encryptedPassword,
    });

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Teacher signup details added successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding details of signup for teacher in addDetail function",
      error.code == 11000
        ? "Signup details of this teacher already exists!"
        : "Error adding signup details for teacher"
    );
  }
};

/*
@desc: Update details of signup
@access: Private
*/
exports.updateDetail = async (req, res, next) => {
  try {
    //Get the id from the url
    const reviewId = req.query.reviewId;

    //Get the password from the body
    const password = req.body.password;

    //Validate the id
    if (isValidId(reviewId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for teacher in updateDetail function",
        "Please provide a valid review id!"
      );
    }
    //Get the review
    const teacherSignUpDetails = await teacherSignUpSchema.findOne({
      _id: reviewId,
    });

    //If there is on details present
    if (teacherSignUpDetails == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for teacher in updateDetail function",
        "There is no teacher detail with this id!"
      );
    }
    //Validate the password
    if (isValid(password, 6) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for teacher in updateDetail function",
        "Password should be of minimum 6 characters!"
      );
    }

    //Encrypt the password
    const encryptedPassword = encrypt(password);
    teacherSignUpDetails.password = encryptedPassword;

    //Save the result
    await teacherSignUpDetails.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Teacher signup details updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating details of signup for teacher in updateDetail function",
      "Error updating signup details for teacher"
    );
  }
};

/*
@desc: Get details of signup for a teacher
@access: Private
*/
exports.getTeacherPassword = async (req, res, next) => {
  try {
    //Get the teacher id from the url
    const teacherId = req.query.teacherId;

    //Validate the teacher url
    if (isValidId(teacherId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching detail of signup for teacher in getTeacherPassword function",
        "Please provide a valid teacher id!"
      );
    }

    //Get the details and decrypt the password
    const teacherDetail = await teacherSignUpSchema.findOne({
      teacherId: teacherId,
    });

    //Validate the teacher
    if (teacherDetail == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching detail of signup for teacher in getTeacherPassword function",
        "There is no teacher with this id present!"
      );
    }

    const password = decrypt(teacherDetail.password);

    //return the result
    return res.status(200).json({
      success: true,
      password: password,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching details of signup for teacher in getTeacherPassword function",
      "Error fetching signup password for teacher"
    );
  }
};

/*
@desc: Delete details of signup for a teacher
@access: Private
*/
exports.deleteTeacherDetail = async (req, res, next) => {
  try {
    //Get the teacher id from the url
    const teacherId = req.query.teacherId;

    //Validate the teacher url
    if (isValidId(teacherId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting detail of signup for teacher in deleteTeacherDetail function",
        "Please provide a valid teacher id!"
      );
    }

    //Get the details
    const teacherDetail = await teacherSignUpSchema.findOneAndDelete({
      teacherId: teacherId,
    });

    //Validate the teacher
    if (teacherDetail == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting detail of signup for teacher in deleteTeacherDetail function",
        "There is no teacher with this id present!"
      );
    }

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Details deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting details of signup for teacher in deleteTeacherDetail function",
      "Error deleting signup details for teacher!"
    );
  }
};
