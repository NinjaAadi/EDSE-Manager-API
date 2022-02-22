const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { isValid } = require("../../validators/check_valid_value");
const { encrypt, decrypt } = require("../../helper/encrypt_decrypt");

//Bring the nonTeachingStaff schema
const nonTeachingStaffSignUpSchema = require("../../models/non_teaching_staff/non_teaching_staff_signup");
//Bring the nonTeachingStaff profile schema
const nonTeachingStaffProfileSchema = require("../../models/non_teaching_staff/non_teaching_staff");
/*
@desc: Add details of signup for nonTeachingStaff
@access: Private
*/
exports.addDetail = async (req, res, next) => {
  try {
    //Get the id from the url
    const nonTeachingStaffId = req.query.nonTeachingStaffId;

    //Get the password from the body
    const password = req.body.password;

    //Validate the id
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
        "Error adding details of signup for nonTeachingStaff in addDetail function",
        "Please provide a valid nonTeachingStaff id!"
      );
    }

    //Validate the password
    if (isValid(password, 6) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding details of signup for nonTeachingStaff in addDetail function",
        "Password should be of minimum 6 characters!"
      );
    }

    //Encrypt the password
    const encryptedPassword = encrypt(password);

    //Save it into the database
    await nonTeachingStaffSignUpSchema.create({
      nonTeachingStaffId: nonTeachingStaffId,
      password: encryptedPassword,
    });

    //return the result
    return res.status(200).json({
      success: true,
      messege: "nonTeachingStaff signup details added successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding details of signup for nonTeachingStaff in addDetail function",
      error.code == 11000
        ? "Signup details of this nonTeachingStaff already exists!"
        : "Error adding signup details for nonTeachingStaff"
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
        "Error updating details of signup for nonTeachingStaff in updateDetail function",
        "Please provide a valid review id!"
      );
    }
    //Get the review
    const nonTeachingStaffSignUpDetails =
      await nonTeachingStaffSignUpSchema.findOne({
        _id: reviewId,
      });

    //If there is on details present
    if (nonTeachingStaffSignUpDetails == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for nonTeachingStaff in updateDetail function",
        "There is no nonTeachingStaff detail with this id!"
      );
    }
    //Validate the password
    if (isValid(password, 6) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating details of signup for nonTeachingStaff in updateDetail function",
        "Password should be of minimum 6 characters!"
      );
    }

    //Encrypt the password
    const encryptedPassword = encrypt(password);
    nonTeachingStaffSignUpDetails.password = encryptedPassword;

    //Save the result
    await nonTeachingStaffSignUpDetails.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "nonTeachingStaff signup details updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating details of signup for nonTeachingStaff in updateDetail function",
      "Error updating signup details for nonTeachingStaff"
    );
  }
};

/*
@desc: Get details of signup for a nonTeachingStaff
@access: Private
*/
exports.getNonTeachingStaffPassword = async (req, res, next) => {
  try {
    //Get the nonTeachingStaff id from the url
    const nonTeachingStaffId = req.query.nonTeachingStaffId;

    //Validate the nonTeachingStaff url
    if (isValidId(nonTeachingStaffId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching detail of signup for nonTeachingStaff in getNonTeachingStaffPassword function",
        "Please provide a valid nonTeachingStaff id!"
      );
    }

    //Get the details and decrypt the password
    const nonTeachingStaffDetail = await nonTeachingStaffSignUpSchema.findOne({
      nonTeachingStaffId: nonTeachingStaffId,
    });

    //Validate the nonTeachingStaff
    if (nonTeachingStaffDetail == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching detail of signup for nonTeachingStaff in getNonTeachingStaffPassword function",
        "There is no nonTeachingStaff with this id present!"
      );
    }

    const password = decrypt(nonTeachingStaffDetail.password);

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
      "Error fetching details of signup for nonTeachingStaff in getNonTeachingStaffPassword function",
      "Error fetching signup password for nonTeachingStaff"
    );
  }
};

/*
@desc: Delete details of signup for a nonTeachingStaff
@access: Private
*/
exports.deleteNonTeachingStaffDetail = async (req, res, next) => {
  try {
    //Get the nonTeachingStaff id from the url
    const nonTeachingStaffId = req.query.nonTeachingStaffId;

    //Validate the nonTeachingStaff url
    if (isValidId(nonTeachingStaffId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting detail of signup for nonTeachingStaff in deleteNonTeachingStaffDetail function",
        "Please provide a valid nonTeachingStaff id!"
      );
    }

    //Get the details
    const nonTeachingStaffDetail =
      await nonTeachingStaffSignUpSchema.findOneAndDelete({
        nonTeachingStaffId: nonTeachingStaffId,
      });

    //Validate the nonTeachingStaff
    if (nonTeachingStaffDetail == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting detail of signup for nonTeachingStaff in deleteNonTeachingStaffDetail function",
        "There is no nonTeachingStaff with this id present!"
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
      "Error deleting details of signup for nonTeachingStaff in deleteNonTeachingStaffDetail function",
      "Error deleting signup details for nonTeachingStaff!"
    );
  }
};
