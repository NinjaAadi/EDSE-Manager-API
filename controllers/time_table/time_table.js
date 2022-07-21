const errorHandler = require("../../error/error");
const isValidTimeTable = require("../../validators/time_table_validator");
//Bring the time table schema
const timeTableSchema = require("../../models/time_table/time_table.js");
//Bring the class schema
const classSchema = require("../../models/class/class");
//Bring the time table with class relation schema
const TimeTableClassRelation = require("../../models/time_table/class_to_timetable_relation");
const isValidId = require("../../validators/valid_objectid");
const {
  isValid,
  isPresentinArray,
} = require("../../validators/check_valid_value");
const class_to_timetable_relation = require("../../models/time_table/class_to_timetable_relation");

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
    const finalTimeTable = await timeTableSchema.create({
      timeTable: timeTable,
    });

    //Return the response
    return res.status(200).json({
      success: true,
      messege: "Time table inserted successfully!",
      id: finalTimeTable._id,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding a timeTable in addTimeTable function",
      error.name == "ValidationError"
        ? "Please provide a valid value for timetable"
        : "Error adding a time table"
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
    //Delete all the relation of this time table
    await TimeTableClassRelation.deleteMany({ _id: timeTableId });
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

/*
@desc: Associate a time table with class
@access: Private
*/
exports.relateTimeTable = async (req, res, next) => {
  try {
    //Get the time table id and for which is it to relate from the url
    const { timeTableId, classId } = req.query;

    //Validate the time table
    if (
      isValidId(timeTableId) == false ||
      (await timeTableSchema.findOne({ _id: timeTableId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error relating time table in relateTimetable function",
        "Please enter a valid time table id"
      );
    }
    //Validate the class Id
    if (
      isValidId(classId) == false ||
      (await classSchema.findOne({ _id: classId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error relating time table in relateTimetable function",
        "Please provide a valid class Id"
      );
    }
    const timeTableRelation = await TimeTableClassRelation.findOne({
      classId: classId,
    });
    //Check if the class is already having a time table or not
    if (timeTableRelation != null) {
      timeTableRelation.timeTableId = timeTableId;
      await timeTableRelation.save();
    } else {
      //Enter the details
      await TimeTableClassRelation.create({
        timeTableId: timeTableId,
        classId: classId,
      });
    }

    return res.status(200).json({
      success: true,
      messege: "Time table added for this class successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error relating a time table in relateTimeTable function",
      "Error relating a time table"
    );
  }
};

/*
  @desc: Get the time table for a particular class
  @access: Public
*/
exports.getTimeTableForClass = async (req, res, next) => {
  try {
    //Get the time table id and for which is it to relate from the url
    const { classId } = req.query;


    //Validate the teacher Id
    if (
      isValidId(classId) == false ||
      (await classSchema.findOne({ _id: classId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching time table in getTimeTableForClass function",
        "Please provide a valid class Id"
      );
    }
    const timeTableRelation = await TimeTableClassRelation.findOne({
      classId: classId,
    }).populate({
      path: "timeTableId",
      populate: {
        path: "timeTable",
        populate: [
          {
            path: "dayName",
          },
          {
            path: "dayTimeTable.time",
          },
          {
            path: "dayTimeTable.subject",
          },
        ],
      },
    });
    //Check if the class is already having a time table or not

    return res.status(200).json({
      success: true,
      data: timeTableRelation == null ? null : timeTableRelation.timeTableId,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching a time table in getTimeTableForClass function",
      "Error fetching a time table"
    );
  }
};
