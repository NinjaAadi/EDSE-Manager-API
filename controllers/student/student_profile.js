const {
  isValid,
  validGender,
  validDate,
} = require("../../validators/check_valid_value");
const convertToObjectId = require("../../helper/string_to_objectidarray");
const isValidFile = require("../../validators/file_validator");
const isValidId = require("../../validators/valid_objectid");
const errorHandler = require("../../error/error");
const mongoose = require("mongoose");
const uploadAndGetFileName = require("../../helper/upload_and_get_filename");
const removeFile = require("../../helper/remove_file");

//Import the student profile schema
const studentProfileSchema = require("../../models/student/student_profile");

/*
@desc:Upload a student profile
@access: Private
*/

exports.addStudentProfile = async (req, res, next) => {
  try {
    //Get the profile from req.body
    const profileImage = req.files ? req.files.file : null;
    console.log(profileImage);
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
      parentNumber,
      fatherName,
      motherName,
    } = req.body;

    //Validate all the required fields
    if (
      isValid(fullName) == false ||
      isValid(address) == false ||
      isValid(phoneNumber, 10) == false ||
      isValid(parentNumber, 10) == false ||
      isValid(fatherName) == false ||
      isValid(motherName) == false ||
      isValidFile(profileImage) == false ||
      validGender(gender) == false ||
      validDate(birthday) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error uploading student profile in addStudentProfile function",
        "Please enter all the values properly!"
      );
    }
    //Convert to valid objectid arrays
    courses = convertToObjectId(courses);
    transportAddress = convertToObjectId(transportAddress);
    role = convertToObjectId(role);

    //Create the object to be inserted
    const studentProfileObj = {
      profileImageURL: "default.jpg",
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      courses,
      transportAddress,
      parentNumber,
      fatherName,
      motherName,
    };
    //Insert the profile into the database
    let studentProfile = await studentProfileSchema.create(studentProfileObj);

    //Get the id of the student
    const studentId = studentProfile._id;

    //Change the file name and then upload it in the image section
    const fileNameToInsert = await uploadAndGetFileName(
      profileImage,
      studentId,
      process.env.PROFILE_FILE_UPLOAD_PATH
    );
    //Save the profile again with the image
    studentProfile = await studentProfileSchema.findById(studentId);
    studentProfile.profileImageURL = fileNameToInsert;
    await studentProfile.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Profile created successfully",
      data: studentProfile,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding student profile in addProfile function",
      "Error adding student profile. Please try again!"
    );
  }
};

/*
@desc: Update a profile
@access: Private
*/
exports.updateStudentProfile = async (req, res, next) => {
  try {
    //Get the studentProfile id
    const studentId = req.query.studentId;

    //Get the profile from req.body
    const profileImage = req.files ? req.files.file : null;

    //Flag to see if there is a new profileImage
    let isProfileImageToBeUpdated = false;
    if (profileImage != null) isProfileImageToBeUpdated = true;

    //Validate the id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating profile in updateStudentProfile function",
        "Please enter a valid student profile id"
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
      parentNumber,
      fatherName,
      motherName,
    } = req.body;
    //Validate all the required fields
    if (
      isValid(fullName) == false ||
      isValid(address) == false ||
      isValid(phoneNumber, 10) == false ||
      isValid(parentNumber, 10) == false ||
      isValid(fatherName) == false ||
      isValid(motherName) == false ||
      validGender(gender) == false ||
      validDate(birthday) == false ||
      (isProfileImageToBeUpdated ? isValidFile(profileImage) == false : false)
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating student profile in updateStudentProfile function",
        "Please enter all the values properly!"
      );
    }

    //Convert to valid objectid arrays
    courses = convertToObjectId(courses);
    transportAddress = convertToObjectId(transportAddress);
    role = convertToObjectId(role);

    //Create the object to be inserted
    const studentProfileObj = {
      fullName,
      address,
      phoneNumber,
      role,
      birthday,
      gender,
      courses,
      transportAddress,
      parentNumber,
      fatherName,
      motherName,
    };

    //Get the profile from the role
    const studentProfile = await studentProfileSchema.findOne({
      _id: studentId,
    });

    //If null then return error
    if (studentProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating student profile",
        "No student with this id present. Please try again!"
      );
    }

    //Update the profileImage if needed else let it remain the same
    if (isProfileImageToBeUpdated) {
      //Remove the file from the server
      if (studentProfile.profileImageURL != "default.jpg")
        await removeFile(
          studentProfile.profileImageURL,
          process.env.PROFILE_FILE_UPLOAD_PATH
        );

      //Get the new file name and upload it
      studentProfileObj.profileImageURL = await uploadAndGetFileName(
        profileImage,
        studentId,
        process.env.PROFILE_FILE_UPLOAD_PATH
      );
    } else {
      studentProfileObj.profileImageURL = studentProfile.profileImageURL;
    }
    //Update to the existing database
    const newStudentProfile = await studentProfileSchema.findByIdAndUpdate(
      studentId,
      studentProfileObj,
      { new: true }
    );

    //Return the respose
    return res.status(200).json({
      success: "True",
      messege: "Profile updated successfully!",
      data: newStudentProfile,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating student profile in updateStudentProfile function",
      "Error updating student profile. Please try again!"
    );
  }
};

/*
@desc: Get a single profile
@access: Public
*/
exports.getStudentProfile = async (req, res, next) => {
  try {
    //Fetch the student id from the url
    const studentId = req.query.studentId;

    //Validate the id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a student profile in getStudentProfile function",
        "Please enter a valid student profile id"
      );
    }

    //Find the profile with the id and populate all the fields
    const studentProfile = await studentProfileSchema
      .findOne({
        _id: studentId,
      })
      .populate(["courses", "role", "transportAddress"]);

    //If it is null then there is no profile with this id
    if (studentProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a student profile in getStudentProfile function",
        "No student with this id present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      data: studentProfile,
    });
  } catch (error) {
    print(error);
    return await errorHandler(
      res,
      next,
      error,
      "Error getting a student profile in getStudentProfile function",
      "Error getting a student profile. Please try again!"
    );
  }
};

/*
@desc: Delete a profile
@access: Private
*/
exports.deleteStudentProfile = async (req, res, next) => {
  try {
    //Fetch the student id from the url
    const studentId = req.query.studentId;

    //Validate the id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a student profile in deleteStudentProfile function",
        "Please enter a valid student profile id"
      );
    }

    //Find the profile with the id and delete it
    const studentProfile = await studentProfileSchema.findOneAndDelete({
      _id: studentId,
    });

    //If it is null then there is no profile with this id
    if (studentProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting  a student profile in deleteStudentProfile function",
        "No student with this id present. Please try again!"
      );
    }

    //Delete the photo associated with the profile
    await removeFile(
      studentProfile.profileImageURL,
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
      "Error deleting a student profile in deleteStudentProfile function",
      "Error deleting a student profile. Please try again!"
    );
  }
};
