const errorHandler = require("../../error/error");
const isValidTimeTable = require("../../validators/time_table_validator");
//Bring the time table schema
const timeTableSchema = require("../../models/time_table/time_table.js");
const isValidId = require("../../validators/valid_objectid");

/*
@desc: Add a time table
@access: Private
*/

exports.addTimeTable = async (req, res, next) => {
  try {
    //Get the time table from the body
    const timeTable = req.body.timeTable;

    //Validate the time table
    if (isValidTimeTable(timeTable) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a time table in addTimeTable function",
        "Incorrect timetable data! Please try again!"
      );
    }

    //Insert the time table into the database
    await timeTableSchema.create({ timeTable: timeTable });

    //Return the response
    return res.status(200).json({
      success: true,
      messege: "Time table inserted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding a timeTable in addTimeTable function",
      "Error adding a time table"
    );
  }
};

/*
@desc: Update a time table
@access: Private
*/
exports.updateTimeTable = async (req, res, next) => {
  try {
    //Get the timeTable id
    const timeTableId = req.query.timeTableId;

    //Validate the id
    if (isValidId(timeTableId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a timeTable in updateTimeTable function",
        "Please provide a valid time table id!"
      );
    }

    //Get the time table from the body
    const timeTable = req.body.timeTable;

    //Validate the time table
    if (isValidTimeTable(timeTable) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a time table in updateTimeTable function",
        "Incorrect timetable data! Please try again!"
      );
    }

    //Insert the time table into the database
    const newTimeTable = await timeTableSchema.findByIdAndUpdate(
      timeTableId,
      {
        timeTable: timeTable,
      },
      { new: true }
    );

    //Return the response
    return res.status(200).json({
      success: true,
      messege: "Time table updated successfully!",
      timeTable: newTimeTable,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating a timeTable in updateTimeTable function",
      "Error updating a time table"
    );
  }
};
/*
@desc: Get a time table
@access: Private
*/

exports.getTimeTable = async (req, res, next) => {
  try {
    //Get the timeTable id
    const timeTableId = req.query.timeTableId;

    //Validate the id
    if (isValidId(timeTableId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a timeTable in getTimeTable function",
        "Please provide a valid time table id!"
      );
    }

    //Search for the time table
    const timeTable = await timeTableSchema
      .findOne({ _id: timeTableId })
      .populate([
        "timeTable.dayName",
        "timeTable.dayTimeTable.time",
        "timeTable.dayTimeTable.subject",
      ]);

    //Return the result
    return res.status(200).json({
      success: true,
      data: timeTable,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting a timeTable in getTimeTable function",
      "Error fetching a time table"
    );
  }
};

/*
@desc: Delete a time table
@access: Private
*/
exports.deleteTimeTable = async (req, res, next) => {
  try {
    //Get the timeTable id
    const timeTableId = req.query.timeTableId;

    //Validate the id
    if (isValidId(timeTableId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a timeTable in deleteTimeTable function",
        "Please provide a valid time table id!"
      );
    }

    //Search for the time table and delete the time table with the id
    const timeTable = await timeTableSchema.findOneAndDelete({
      _id: timeTableId,
    });

    //If there is no time table present with this id
    if (timeTable == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting timeTable in deleteTimeTable function",
        "There is no time table present with this id!"
      );
    }

    //Return the result
    return res.status(200).json({
      success: true,
      messege: "Time table deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting a timeTable in getTimeTable function",
      "Error fetching a time table"
    );
  }
};
