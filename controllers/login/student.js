const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { decrypt } = require("../../helper/encrypt_decrypt");
const { getToken } = require("../../helper/jwt");
//Bring the student Profile schema
const studentProfileSchema = require("../../models/student/student_profile");
//Bring the  student Signup detail schema
const studentProfileSignUpSchema = require("../../models/student/student_signup");

/*
@desc: Login for student
@access: Public
*/
exports.studentLogin = async (req, res, next) => {
  try {
    //Get the studentId and password from the url
    const studentId = req.query.studentId;
    const password = req.query.password;

    //Validate the studentId
    if (
      isValidId(studentId) == false ||
      (await studentProfileSchema.findOne({ _id: studentId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error login for student in studentLogin function",
        "Please enter a valid studentId"
      );
    }

    //Get the studentProfileSignUp details for the student
    const studentProfileSignUpDetail = await studentProfileSignUpSchema.findOne(
      {
        studentId: studentId,
      }
    );

    //Validate the details
    if (studentProfileSignUpSchema == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error login for student in studentLogin function",
        "The student is not registered yet!"
      );
    }
    //Match the password
    const decryptedPassword = decrypt(studentProfileSignUpDetail.password);
    if (decryptedPassword != password) {
      return errorHandler(
        res,
        next,
        null,
        "Error login for student in studentLogin function",
        "Incorrect password! Please try again!"
      );
    }

    //Get the jwt token
    const jwtToken = getToken({ id: studentId, for: "Student" });

    return res.status(200).json({
      success: true,
      data: jwtToken,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error login for student in studentLogin function",
      "Error logging in!"
    );
  }
};
