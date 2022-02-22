const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { isValid } = require("../../validators/check_valid_value");
const { encrypt, decrypt } = require("../../helper/encrypt_decrypt");
//Bring the student schema
const studentSignUpSchema = require("../../models/student/student_signup");

//Bring the student profile schema
const studentProfileSchema = require("../../models/student/student_profile");

/*
@desc: Add details of signup
@access: Private
*/
exports.addDetail = async (req, res, next) => {
  try {
    //Get the id from the url
    const studentId = req.query.studentId;

    //Get the password from the body
    const password = req.body.password;

    //Validate the id
    if (
      isValidId(studentId) == false ||
      (await studentProfileSchema.findOne({ _id: studentId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding details of signup for student in addDetail function",
        "Please provide a valid student id!"
      );
    }

    //Validate the password
    if (isValid(password, 6) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding details of signup for student in addDetail function",
        "Password should be of minimum 6 characters!"
      );
    }

    //Encrypt the password
    const encryptedPassword = encrypt(password);

    //Save it into the database
    await studentSignUpSchema.create({
      studentId: studentId,
      password: encryptedPassword,
    });

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Student signup details added successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding details of signup for student in addDetail function",
      error.code == 11000
        ? "Signup details of this student already exists!"
        : "Error adding signup details for student"
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
        "Error updating details of signup for student in updateDetail function",
        "Please provide a valid review id!"
      );
    }
    //Get the review
    const studentSignUpDetails = await studentSignUpSchema.findOne({
      _id: reviewId,
    });

    //If there is on details present
    if (studentSignUpDetails == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for student in updateDetail function",
        "There is no student detail with this id!"
      );
    }
    //Validate the password
    if (isValid(password, 6) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for student in updateDetail function",
        "Password should be of minimum 6 characters!"
      );
    }

    //Encrypt the password
    const encryptedPassword = encrypt(password);
    studentSignUpDetails.password = encryptedPassword;

    //Save the result
    await studentSignUpDetails.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Student signup details updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating details of signup for student in updateDetail function",
      "Error updating signup details for student"
    );
  }
};

/*
@desc: Get details of signup for a student
@access: Private
*/
exports.getStudentPassword = async (req, res, next) => {
  try {
    //Get the student id from the url
    const studentId = req.query.studentId;

    //Validate the student url
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching detail of signup for student in getStudentPassword function",
        "Please provide a valid student id!"
      );
    }

    //Get the details and decrypt the password
    const studentDetail = await studentSignUpSchema.findOne({
      studentId: studentId,
    });

    //Validate the student
    if (studentDetail == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching detail of signup for student in getStudentPassword function",
        "There is no student with this id present!"
      );
    }

    const password = decrypt(studentDetail.password);

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
      "Error fetching details of signup for student in getStudentPassword function",
      "Error fetching signup password for student"
    );
  }
};

/*
@desc: Delete details of signup for a student
@access: Private
*/
exports.deleteStudentDetail = async (req, res, next) => {
  try {
    //Get the student id from the url
    const studentId = req.query.studentId;

    //Validate the student url
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting detail of signup for student in deleteStudentDetail function",
        "Please provide a valid student id!"
      );
    }

    //Get the details
    const studentDetail = await studentSignUpSchema.findOneAndDelete({
      studentId: studentId,
    });

    //Validate the student
    if (studentDetail == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting detail of signup for student in deleteStudentDetail function",
        "There is no student with this id present!"
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
      "Error deleting details of signup for student in deleteStudentDetail function",
      "Error deleting signup details for student!"
    );
  }
};
