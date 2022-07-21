const {
  isValid,
  validGender,
  validDate,
} = require("../../validators/check_valid_value");
const convertToObjectId = require("../../helper/string_to_objectidarray");
const isValidFile = require("../../validators/file_validator");
const isValidId = require("../../validators/valid_objectid");
const errorHandler = require("../../error/error");
const uploadAndGetFileName = require("../../helper/upload_and_get_filename");
const removeFile = require("../../helper/remove_file");

//Import the nonTeachingStaff profile schema
const nonTeachingStaffProfileSchema = require("../../models/non_teaching_staff/non_teaching_staff");

/*
@desc:Upload a nonTeachingStaff profile
@access: Private
*/

exports.addNonTeachingStaffProfile = async (req, res, next) => {
  try {
    //Get the profile from req.body
    const profileImage = req.files ? req.files.file : null;

    //Get all the fields
    let {
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      transportAddress,
    } = req.body;
    //Validate all the required fields
    if (
      isValid(fullName) == false ||
      isValid(address) == false ||
      isValid(phoneNumber, 10) == false ||
      isValidFile(profileImage) == false ||
      validGender(gender) == false ||
      validDate(birthday) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error uploading nonTeachingStaff profile in addNonTeachingStaffProfile function",
        "Please enter all the values properly!"
      );
    }
    //Convert to valid objectid arrays
    transportAddress = convertToObjectId(transportAddress);
    role = convertToObjectId(role);

    //Create the object to be inserted
    const nonTeachingStaffProfileObj = {
      profileImageURL: "default.jpg",
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      transportAddress,
    };
    //Insert the profile into the database
    let nonTeachingStaffProfile = await nonTeachingStaffProfileSchema.create(
      nonTeachingStaffProfileObj
    );

    //Get the id of the nonTeachingStaff
    const nonTeachingStaffId = nonTeachingStaffProfile._id;

    //Change the file name and then upload it in the image section
    const fileNameToInsert = await uploadAndGetFileName(
      profileImage,
      nonTeachingStaffId,
      process.env.PROFILE_FILE_UPLOAD_PATH
    );
    //Save the profile again with the image
    nonTeachingStaffProfile = await nonTeachingStaffProfileSchema.findById(
      nonTeachingStaffId
    );
    nonTeachingStaffProfile.profileImageURL = fileNameToInsert;
    await nonTeachingStaffProfile.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Profile created successfully",
      data: nonTeachingStaffProfile,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding nonTeachingStaff profile in addNonTeachingStaff function",
      "Error adding nonTeachingStaff profile. Please try again!"
    );
  }
};

/*
@desc: Update a profile
@access: Private
*/
exports.updateNonTeachingStaffProfile = async (req, res, next) => {
  try {
    //Get the nonTeachingStaffProfile id
    const nonTeachingStaffId = req.query.nonTeachingStaffId;

    //Get the profile from req.body
    const profileImage = req.files ? req.files.file : null;

    //Flag to see if there is a new profileImage
    let isProfileImageToBeUpdated = false;
    if (profileImage != null) isProfileImageToBeUpdated = true;

    //Validate the id
    if (isValidId(nonTeachingStaffId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating profile in updateNonTeachingStaff function",
        "Please enter a valid nonTeachingStaff profile id"
      );
    }
    //Get all the fields
    let {
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      transportAddress,
    } = req.body;
    //Validate all the required fields
    if (
      isValid(fullName) == false ||
      isValid(address) == false ||
      isValid(phoneNumber, 10) == false ||
      isValid(transportAddress) == false ||
      isValid(role) == false ||
      validGender(gender) == false ||
      validDate(birthday) == false ||
      (isProfileImageToBeUpdated ? isValidFile(profileImage) == false : false)
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating nonTeachingStaff profile in updateNonTeachingStaff function",
        "Please enter all the values properly!"
      );
    }

    //Convert to valid objectid arrays
    transportAddress = convertToObjectId(transportAddress);
    role = convertToObjectId(role);

    //Create the object to be inserted
    const nonTeachingStaffProfileObj = {
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      transportAddress,
    };

    //Get the profile from the role
    const nonTeachingStaffProfile = await nonTeachingStaffProfileSchema.findOne(
      {
        _id: nonTeachingStaffId,
      }
    );

    //If null then return error
    if (nonTeachingStaffProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating nonTechingStaff profile",
        "No nonTeachingStaff with this id present. Please try again!"
      );
    }

    //Update the profileImage if needed else let it remain the same
    if (isProfileImageToBeUpdated) {
      //Remove the file from the server
      if (nonTeachingStaffProfile.profileImageURL != "default.jpg")
        await removeFile(
          nonTeachingStaffProfile.profileImageURL,
          process.env.PROFILE_FILE_UPLOAD_PATH
        );

      //Get the new file name and upload it
      nonTeachingStaffProfileObj.profileImageURL = await uploadAndGetFileName(
        profileImage,
        nonTeachingStaffId,
        process.env.PROFILE_FILE_UPLOAD_PATH
      );
    } else {
      nonTeachingStaffProfileObj.profileImageURL =
        nonTeachingStaffProfile.profileImageURL;
    }
    //Update to the existing database
    const newNonTeachingStaffProfile =
      await nonTeachingStaffProfileSchema.findByIdAndUpdate(
        nonTeachingStaffId,
        nonTeachingStaffProfileObj,
        { new: true }
      );

    //Return the respose
    return res.status(200).json({
      success: "True",
      messege: "Profile updated successfully!",
      data: newNonTeachingStaffProfile,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating nonTeachingStaff profile in updatenonTeachingStaffProfile function",
      "Error updating nonTeachingStaff profile. Please try again!"
    );
  }
};

/*
@desc: Get a single profile
@access: Public
*/
exports.getNonTeachingStaffProfile = async (req, res, next) => {
  try {
    //Fetch the nonTeachingStaff id from the url
    const nonTeachingStaffId = req.query.nonTeachingStaffId;

    //Validate the id
    if (isValidId(nonTeachingStaffId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a nonTeachingStaff profile in getnonTeachingStaffProfile function",
        "Please enter a valid nonTeachingStaff profile id"
      );
    }

    //Find the profile with the id and populate all the fields
    const nonTeachingStaffProfile = await nonTeachingStaffProfileSchema
      .findOne({
        _id: nonTeachingStaffId,
      })
      .populate("role");

    //If it is null then there is no profile with this id
    if (nonTeachingStaffProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a nonTeachingStaff profile in getnonTeachingStaffProfile function",
        "No nonTeachingStaff with this id present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      data: nonTeachingStaffProfile,
    });
  } catch (error) {
    console.log(error);
    return await errorHandler(
      res,
      next,
      error,
      "Error getting a nonTeachingStaff profile in getnonTeachingStaffProfile function",
      "Error getting a nonTeachingStaff profile. Please try again!"
    );
  }
};

/*
@desc: Delete a profile
@access: Private
*/
exports.deleteNonTeachingStaffProfile = async (req, res, next) => {
  try {
    //Fetch the nonTeachingStaff id from the url
    const nonTeachingStaffId = req.query.nonTeachingStaffId;

    //Validate the id
    if (isValidId(nonTeachingStaffId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a nonTeaching profile in deletenonTeachingProfile function",
        "Please enter a valid nonTeaching profile id"
      );
    }

    //Find the profile with the id and delete it
    const nonTeachingStaffProfile =
      await nonTeachingStaffProfileSchema.findOneAndDelete({
        _id: nonTeachingStaffId,
      });

    //If it is null then there is no profile with this id
    if (nonTeachingStaffProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a nonTeachingStaff profile in deleteTeachingStaffProfile function",
        "No nonTeachingStaff with this id present. Please try again!"
      );
    }
    await removeFile(
      nonTeachingStaffProfile.profileImageURL,
      PROFILE_FILE_UPLOAD_PATH
    );
    return res.status(200).json({
      success: true,
      messege: "Profile deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting a nonTeachingStaff profile in deletenonTeachingStaffProfile function",
      "Error deleting a nonTeachingStaff profile. Please try again!"
    );
  }
};
