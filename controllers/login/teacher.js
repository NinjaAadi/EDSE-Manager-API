const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { decrypt } = require("../../helper/encrypt_decrypt");
const { getToken } = require("../../helper/jwt");
//Bring the teacher Profile schema
const teacherProfileSchema = require("../../models/teacher/teacher_profile");
//Bring the  teacher Signup detail schema
const teacherProfileSignUpSchema = require("../../models/teacher/teacher_signup");

/*
@desc: Login for teacher
@access: Public
*/
exports.teacherLogin = async (req, res, next) => {
  try {
    //Get the teacherId and password from the url
    const teacherId = req.query.teacherId;
    const password = req.query.password;

    //Validate the teacherId
    if (
      isValidId(teacherId) == false ||
      (await teacherProfileSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error login for teacher in teacherLogin function",
        "Please enter a valid teacherId"
      );
    }

    //Get the teacherProfileSignUp details for the teacher
    const teacherProfileSignUpDetail = await teacherProfileSignUpSchema.findOne(
      {
        teacherId: teacherId,
      }
    );

    //Validate the details
    if (teacherProfileSignUpDetail == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error login for teacher in teacherLogin function",
        "The teacher is not registered yet!"
      );
    }
    //Match the password
    const decryptedPassword = decrypt(teacherProfileSignUpDetail.password);
    if (decryptedPassword != password) {
      return errorHandler(
        res,
        next,
        null,
        "Error login for teacher in teacherLogin function",
        "Incorrect password! Please try again!"
      );
    }

    //Get the jwt token
    const jwtToken = getToken({ id: teacherId, for: "Teacher" });

    return res.status(200).json({
      success: true,
      data: jwtToken,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error login for teacher in teacherLogin function",
      "Error logging in!"
    );
  }
};
