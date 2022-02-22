const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { decrypt } = require("../../helper/encrypt_decrypt");
const { getToken } = require("../../helper/jwt");
//Bring the nonTeachingStaff Profile schema
const nonTeachingStaffProfileSchema = require("../../models/non_teaching_staff/non_teaching_staff");
//Bring the nonTeachingStaff Signup detail schema
const nonTeachingStaffSignUpSchema = require("../../models/non_teaching_staff/non_teaching_staff_signup");

/*
@desc: Login for nonTeachingStaff
@access: Public
*/
exports.nonTeachingStaffLogin = async (req, res, next) => {
  try {
    //Get the nonTeachingStaffId and password from the url
    const nonTeachingStaffId = req.query.nonTeachingStaffId;
    const password = req.query.password;

    //Validate the nonTeachingStaffId
    if (
      isValidId(nonTeachingStaffId) == false ||
      (await nonTeachingStaffProfileSchema.findOne({
        _id: nonTeachingStaffId,
      })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error login for nonTeachingStaff in nonTeachingStaffLogin function",
        "Please enter a valid nonTeachingStaffId"
      );
    }

    //Get the nonTeachingStaffProfileSignUp details for the nonTeachingStaff
    const nonTeachingStaffProfileSignUpDetail =
      await nonTeachingStaffSignUpSchema.findOne({
        nonTeachingStaffId: nonTeachingStaffId,
      });

    //Validate the details
    if (nonTeachingStaffProfileSignUpDetail == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error login for nonTeachingStaff in nonTeachingStaffLogin function",
        "The nonTeachingStaff is not registered yet!"
      );
    }
    //Match the password
    const decryptedPassword = decrypt(
      nonTeachingStaffProfileSignUpDetail.password
    );
    if (decryptedPassword != password) {
      return errorHandler(
        res,
        next,
        null,
        "Error login for nonTeachingStaff in nonTeachingStaffLogin function",
        "Incorrect password! Please try again!"
      );
    }

    //Get the jwt token
    const jwtToken = getToken({
      id: nonTeachingStaffId,
      for: "nonTeachingStaff",
    });

    return res.status(200).json({
      success: true,
      data: jwtToken,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error login for nonTeachingStaff in nonTeachingStaffLogin function",
      "Error logging in!"
    );
  }
};
