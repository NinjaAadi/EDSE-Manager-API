const errorHandler = require("../../error/error");
const {
  isValid,
  validDate,
  isPresentinArray,
} = require("../../validators/check_valid_value");
const isValidId = require("../../validators/valid_objectid");
const isValidImage = require("../../validators/file_validator");
const uploadAndGetFileName = require("../../helper/upload_and_get_filename");
const removeFile = require("../../helper/remove_file");
//Bring the notice Schema
const noticeSchema = require("../../models/notice/notice");
//Bring the teacher Schema for validation
const teacherSchema = require("../../models/teacher/teacher_profile");


/*
@desc: Add a notice
@access: Private
*/

exports.addNotice = async (req, res, next) => {
  try {
    //Get the file
    const noticeImage = req.files == null ? null : req.files.file;

    //Get the department
    const department = req.query.department;

    //Validate the department
    if (
      department == null ||
      isPresentinArray(department, [
        "Student",
        "Teacher",
        "All",
        "NonTeachingStaff",
      ]) == false
    ) {
      return errorHandler(
        res,
        next,
        null,
        "Error adding notice in addNotice section",
        "Please enter the department of notice!"
      );
    }
    //Get the fields from req.body
    const { heading, date, body, signedBy } = req.body;

    //Validate the fields
    if (
      isValid(heading) == false ||
      validDate(date) == false ||
      isValid(body) == false ||
      isValidId(signedBy) == false ||
      isValidImage(noticeImage) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error in addNotice function",
        "Please enter all the fields properly!"
      );
    }

    //Check that the signedBy profile exists or not
    const signedByProfile = await teacherSchema.findOne({ _id: signedBy });
    if (signedByProfile == null) {
      return await errorHandler(
        res,
        next,
        err,
        "Error adding a notice in addNotice function",
        "The sighned by authority doesn't exist!"
      );
    }
    //Create the notice board object
    const noticeObj = {
      noticeImageURL: "default.jpg",
      heading,
      date,
      body,
      department,
      signedBy,
    };

    //Insert the object in database and get the id to insert the image
    const noticeInfo = await noticeSchema.create(noticeObj);

    //Get the id
    const noticeId = noticeInfo._id;

    //Get the name of the file with this id
    const noticeImageName = await uploadAndGetFileName(
      noticeImage,
      noticeId,
      process.env.NOTICE_FILE_UPLOAD_PATH
    );

    //Save it into the database
    noticeInfo.noticeImageURL = noticeImageName;
    await noticeInfo.save();

    //return the response
    return res.status(200).json({
      success: true,
      messege: "Notice uploaded successfully!",
      data: noticeInfo,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(
      res,
      next,
      error,
      "Error adding a notice in addNotice function",
      "Error adding a notice. Please try again"
    );
  }
};

/*
@desc: Update a notice
@access: Private
*/

exports.updateNotice = async (req, res, next) => {
  try {
    //Get the notice id
    const noticeId = req.query.noticeId;

    //Get the image from req.body
    const noticeImage = req.files ? req.files.file : null;

    //Flag to see if there is a new profileImage
    let isNoticeImageToBeUpdated = false;
    if (noticeImage != null) isNoticeImageToBeUpdated = true;

    //Get the department
    const department = req.query.department;

    //Validate the department
    if (
      department == null ||
      isPresentinArray(department, [
        "Student",
        "Teacher",
        "All",
        "NonTeachingStaff",
      ]) == false
    ) {
      return errorHandler(
        res,
        next,
        null,
        "Error adding notice in addNotice section",
        "Please enter the department of notice!"
      );
    }

    //Validate the id
    if (isValidId(noticeId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating notice in updateNotice function",
        "Please enter a valid notice id"
      );
    }
    //Get all the fields
    let { heading, date, body, signedBy } = req.body;

    //Validate all the required fields
    if (
      isValid(heading) == false ||
      validDate(date) == false ||
      isValid(body) == false ||
      isValidId(signedBy) == false ||
      (isNoticeImageToBeUpdated ? isValidImage(noticeImage) == false : false)
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating notice in updateNotice function",
        "Please enter all the values properly!"
      );
    }

    //Create the object to be inserted
    const noticeObj = {
      heading,
      date,
      body,
      department,
      signedBy,
    };

    //Get the profile from the role
    const notice = await noticeSchema.findOne({
      _id: noticeId,
    });

    //If null then return error
    if (notice == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating notice",
        "No notice with this id present. Please try again!"
      );
    }

    //Update the profileImage if needed else let it remain the same
    if (isNoticeImageToBeUpdated) {
      //Remove the file from the server
      if (notice.profileImageURL != "default.jpg")
        await removeFile(
          notice.noticeImageURL,
          process.env.NOTICE_FILE_UPLOAD_PATH
        );

      //Get the new file name and upload it
      noticeObj.noticeImageURL = await uploadAndGetFileName(
        noticeImage,
        noticeId,
        process.env.NOTICE_FILE_UPLOAD_PATH
      );
    } else {
      noticeObj.profileImageURL = notice.profileImageURL;
    }
    //Update to the existing database
    const newNotice = await noticeSchema.findByIdAndUpdate(
      noticeId,
      noticeObj,
      { new: true }
    );

    //Return the respose
    return res.status(200).json({
      success: "True",
      messege: "Notice updated successfully!",
      data: newNotice,
    });
  } catch (error) {
    return errorHandler(
      res,
      next,
      error,
      "Error updating a notice in updateNotice function",
      "Error updating a notice. Please try again"
    );
  }
};

/*
@desc: Get a notice
@access: Private
*/
exports.getNotice = async (req, res, next) => {
  try {
    //Get the notice id from the URL
    const noticeId = req.query.noticeId;

    //Validate the id
    if (isValidId(noticeId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a notice in getNotice function",
        "Please provide a valid noticeId"
      );
    }

    //Fetch from the database
    const notice = await noticeSchema
      .findOne({ _id: noticeId })
      .populate("signedBy", { fullName: 1, _id: 1 });

    //If there is no notice with this id
    if (notice == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a notice in getNotice function",
        "There is no notice with this id. Please try again!"
      );
    }

    //return the result
    return res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    return errorHandler(
      res,
      next,
      error,
      "Error getting a notice in getNotice function",
      "Error getting a notice. Please try again"
    );
  }
};

/*
@desc: Get all notice
@access: Private
*/
exports.getAllNotice = async (req, res, next) => {
  try {
    //Get the department
    const department = req.query.department;
    //Fetch all the notice from the database
    const allNotice = await noticeSchema.find({
      department: department == null ? "All" : department,
    });
    //Return the result
    return res.status(200).json({
      success: true,
      data: allNotice,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(
      res,
      next,
      error,
      "Error getting all notice in getAllNotice function",
      "Error getting all notice. Please try again"
    );
  }
};

/*
@desc: Delete a notice
@access: Privat
*/
exports.deleteNotice = async (req, res, next) => {
  try {
    //Get the notice id from the URL
    const noticeId = req.query.noticeId;

    //Validate the id
    if (isValidId(noticeId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a notice in deleteNotice function",
        "Please provide a valid noticeId"
      );
    }

    //Find a notice with the id
    const noticeToDelete = await noticeSchema.findOneAndDelete({
      _id: noticeId,
    });

    //If there is no notice with this id
    if (noticeToDelete == null) {
      return errorHandler(
        res,
        next,
        null,
        "Error deleting a notice in deleteNotice function",
        "No notice with this id present!"
      );
    }

    return res.status(200).json({
      success: true,
      messege: "Notice deleted successfully!",
    });
  } catch (error) {
    return errorHandler(
      res,
      next,
      error,
      "Error deleting a notice in deleteNotice function",
      "Error deleting a notice. Please try again"
    );
  }
};
