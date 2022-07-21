const {
  isValid,
  validGender,
  validDate,
} = require("../../validators/check_valid_value");
const isValidFile = require("../../validators/file_validator");
const isValidId = require("../../validators/valid_objectid");
const errorHandler = require("../../error/error");
const uploadAndGetFileName = require("../../helper/upload_and_get_filename");
const removeFile = require("../../helper/remove_file");
const convertToObjectId = require("../../helper/string_to_objectidarray");
//Import the teacher profile schema
const teacherProfileSchema = require("../../models/teacher/teacher_profile");

/*
@desc:Upload a teacher profile
@access: Private
*/

exports.addTeacherProfile = async (req, res, next) => {
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
      courses,
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
        "Error uploading teacher profile in addTeacherProfile function",
        "Please enter all the values properly!"
      );
    }
    //Convert to valid objectid arrays
    courses = convertToObjectId(courses);
    transportAddress = convertToObjectId(transportAddress);
    role = convertToObjectId(role);

    //Create the object to be inserted
    const teacherProfileObj = {
      profileImageURL: "default.jpg",
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      courses,
      transportAddress,
    };
    //Insert the profile into the database
    let teacherProfile = await teacherProfileSchema.create(teacherProfileObj);

    //Get the id of the teacher
    const teacherId = teacherProfile._id;

    //Change the file name and then upload it in the image section
    const fileNameToInsert = await uploadAndGetFileName(
      profileImage,
      teacherId,
      process.env.PROFILE_FILE_UPLOAD_PATH
    );
    //Save the profile again with the image
    teacherProfile = await teacherProfileSchema.findById(teacherId);
    teacherProfile.profileImageURL = fileNameToInsert;
    await teacherProfile.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Profile created successfully",
      data: teacherProfile,
    });
  } catch (error) {
    console.log(error);
    return await errorHandler(
      res,
      next,
      error,
      "Error adding teacher profile in addTeacherProfile function",
      "Error adding teacher profile. Please try again!"
    );
  }
};

/*
@desc: Update a profile
@access: Private
*/
exports.updateTeacherProfile = async (req, res, next) => {
  try {
    //Get the teacherProfile id
    const teacherId = req.query.teacherId;

    //Get the profile from req.body
    const profileImage = req.files ? req.files.file : null;

    //Flag to see if there is a new profileImage
    let isProfileImageToBeUpdated = false;
    if (profileImage != null) isProfileImageToBeUpdated = true;

    //Validate the id
    if (isValidId(teacherId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating profile in updateTeacherProfile function",
        "Please enter a valid teacher profile id"
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
      courses,
      transportAddress,
    } = req.body;
    //Validate all the required fields
    if (
      isValid(fullName) == false ||
      isValid(address) == false ||
      isValid(phoneNumber, 10) == false ||
      isValid(transportAddress) == false ||
      isValid(role) == false ||
      isValid(courses) == false ||
      validGender(gender) == false ||
      validDate(birthday) == false ||
      (isProfileImageToBeUpdated ? isValidFile(profileImage) == false : false)
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating teacher profile in updateTeacherProfile function",
        "Please enter all the values properly!"
      );
    }

    //Convert to valid objectid arrays
    courses = convertToObjectId(courses);
    transportAddress = convertToObjectId(transportAddress);
    role = convertToObjectId(role);

    //Create the object to be inserted
    const teacherProfileObj = {
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      courses,
      transportAddress,
    };

    //Get the profile from the role
    const teacherProfile = await teacherProfileSchema.findOne({
      _id: teacherId,
    });

    //If null then return error
    if (teacherProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating teacher profile",
        "No teacher with this id present. Please try again!"
      );
    }

    //Update the profileImage if needed else let it remain the same
    if (isProfileImageToBeUpdated) {
      //Remove the file from the server
      if (teacherProfile.profileImageURL != "default.jpg")
        await removeFile(
          teacherProfile.profileImageURL,
          process.env.PROFILE_FILE_UPLOAD_PATH
        );

      //Get the new file name and upload it
      teacherProfileObj.profileImageURL = await uploadAndGetFileName(
        profileImage,
        teacherId,
        process.env.PROFILE_FILE_UPLOAD_PATH
      );
    } else {
      teacherProfile.profileImageURL = teacherProfile.profileImageURL;
    }
    //Update to the existing database
    const newTeacherProfile = await teacherProfileSchema.findByIdAndUpdate(
      teacherId,
      teacherProfileObj,
      { new: true }
    );

    //Return the respose
    return res.status(200).json({
      success: "True",
      messege: "Profile updated successfully!",
      data: newTeacherProfile,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating teacher profile in updateTeacherProfile function",
      "Error updating teacher profile. Please try again!"
    );
  }
};

/*
@desc: Get a single profile
@access: Public
*/
exports.getTeacherProfile = async (req, res, next) => {
  try {
    //Fetch the teacher id from the url
    const teacherId = req.query.teacherId;

    //Validate the id
    if (isValidId(teacherId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a teacher profile in getTeacherProfile function",
        "Please enter a valid teacher profile id"
      );
    }

    //Find the profile with the id and populate all the fields
    const teacherProfile = await teacherProfileSchema
      .findOne({
        _id: teacherId,
      })
      .populate(["courses", "role", "transportAddress"]);

    //If it is null then there is no profile with this id
    if (teacherProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a teacher profile in getTeacherProfile function",
        "No teacher with this id present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      data: teacherProfile,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting a teacher profile in getTeacherProfile function",
      "Error getting a teacher profile. Please try again!"
    );
  }
};

/*
@desc: Delete a profile
@access: Private
*/
exports.deleteTeacherProfile = async (req, res, next) => {
  try {
    //Fetch the teacher id from the url
    const teacherId = req.query.teacherId;

    //Validate the id
    if (isValidId(teacherId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a teacher profile in deleteTeacherProfile function",
        "Please enter a valid teacher profile id"
      );
    }

    //Find the profile with the id and delete it
    const teacherProfile = await teacherProfileSchema.findOneAndDelete({
      _id: teacherId,
    });

    //If it is null then there is no profile with this id
    if (teacherProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a teacher profile in deleteTeacherProfile function",
        "No teacher with this id present. Please try again!"
      );
    }

    //Delete the profile associated with it
    await removeFile(
      teacherProfile.profileImageURL,
      process.env.PROFILE_FILE_UPLOAD_PATH
    );

    return res.status(200).json({
      success: true,
      messege: "Profile deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting a teacher profile in deleteTeacherProfile function",
      "Error deleting a teacher profile. Please try again!"
    );
  }
};
