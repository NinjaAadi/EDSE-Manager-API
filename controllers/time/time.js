const errorHandler = require("../../error/error");
const {
  isValidTimeString,
  isValidTimeStamp,
} = require("../../validators/check_valid_value");
const isValidId = require("../../validators/valid_objectid");
//Bring the time schema
const timeSchema = require("../../models/time/time");

/*
@desc: Add a time stamp
@access: Private
*/
exports.addTime = async (req, res, next) => {
  try {
    //Bring the start and the end time from the body
    const { startTime, endTime } = req.body;

    //Validate the strings
    if (
      isValidTimeString(startTime) == false ||
      isValidTimeString(endTime) == false ||
      isValidTimeStamp(startTime, endTime) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding time in addTime function",
        "Please provide a valid time stamp"
      );
    }

    //Insert into the database
    const timeStamp = await timeSchema.create({
      startTime: startTime,
      endTime: endTime,
    });
    return res.status(200).json({
      success: true,
      messege: "Time stamp created successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding time in addTime function",
      error.code == 11000
        ? "A time stamp with this start time already present"
        : "Error adding time stamp. Please try again!"
    );
  }
};

/*
@desc: Get all time stamp
@access: Public
*/
exports.getAllTime = async (req, res, next) => {
  try {
    const allTimeStamp = await timeSchema.find().sort();
    return res.status(200).json({
      success: true,
      data: allTimeStamp,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting all time in getAllTime function",
      "Error fetching all time stamps. Please try again!"
    );
  }
};
/*
@desc: Update a time stamp
@access: Private
*/
exports.updateTime = async (req, res, next) => {
  try {
    //Get the id from the URL
    const timeId = req.query.timeId;

    //Bring the start and the end time from the body
    const { startTime, endTime } = req.body;

    //Validate the id
    if (isValidId(timeId) == false) {
      return errorHandler(
        res,
        next,
        null,
        "Error in updating time in updateTime function",
        "Please provide a valid time Id"
      );
    }

    //Validate the strings
    if (
      isValidTimeString(startTime) == false ||
      isValidTimeString(endTime) == false ||
      isValidTimeStamp(startTime, endTime) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding time in updateTIme function",
        "Please provide a valid time stamp"
      );
    }
    const timeObj = { startTime, endTime };

    //Find the time stamp with this id and update
    const timeStamp = await timeSchema.findByIdAndUpdate(timeId, timeObj, {
      new: true,
    });

    //If timeStamp is null then return error
    if (timeStamp == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating time in updateTime function",
        "No time stamp with this id present!"
      );
    }
    //Return the respose
    return res.status(200).json({
      success: true,
      messege: "Time stamp updated successfully!",
      data: timeStamp,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating time in updateTime function",
      "Error updating the time stamps. Please try again!"
    );
  }
};

/*
@desc: Delete a time stamp
@access: Private
*/

exports.deleteTime = async (req, res, next) => {
  try {
    //Get the id from the URL
    const timeId = req.query.timeId;

    //Validate the id
    if (isValidId(timeId) == false) {
      return errorHandler(
        res,
        next,
        null,
        "Error in updating time in updateTime function",
        "Please provide a valid time Id"
      );
    }

    //Get the time stamp with the id
    const timeStamp = await timeSchema.findOneAndDelete({ _id: timeId });

    //If there is no time stamp then return error
    if (timeStamp == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting time in deleteTime function",
        "No time stamp present with the given id!"
      );
    }

    //Return the response
    return res.status(200).json({
      success: true,
      messege: "Time stamp deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting time in deleteTime function",
      "Error deleting the time stamps. Please try again!"
    );
  }
};
