const errorHandler = require("../../error/error");
const isValidTimeTable = require("../../validators/teacher_time_table_validator");
//Bring the time table schema
const TeacherTimeTableSchema = require("../../models/time_table/teacher_time_table");
//Bring the teacher schema
const TeacherScema = require("../../models/teacher/teacher_profile");

//Bring the relation schema
const TeacherTimeTableRelationSchema = require("../../models/time_table/teacher_to_timetable_relation");
const isValidId = require("../../validators/valid_objectid");
const {
  isValid,
  isPresentinArray,
} = require("../../validators/check_valid_value");

/*
@desc: Add a time table for teacher
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
    await TeacherTimeTableSchema.create({ timeTable: timeTable });

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
    const newTimeTable = await TeacherTimeTableSchema.findByIdAndUpdate(
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
    const timeTable = await TeacherTimeTableSchema.findOne({
      _id: timeTableId,
    }).populate([
      "timeTable.dayName",
      "timeTable.dayTimeTable.time",
      "timeTable.dayTimeTable.subject",
      "timeTable.dayTimeTable.className",
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
    const timeTable = await TeacherTimeTableSchema.findOneAndDelete({
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
    //Delete all the relations from the teacher timetable relation
    await TeacherTimeTableRelationSchema.deleteMany({
      timeTableId: timeTableId,
    });
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
@desc: Associate a time table with teacher
@access: Private
*/
exports.relateTimeTable = async (req, res, next) => {
  try {
    //Get the time table id and for which is it to relate from the url
    const { timeTableId, teacherId } = req.query;

    //Validate the time table
    if (
      isValidId(timeTableId) == false ||
      (await TeacherTimeTableSchema.findOne({ _id: timeTableId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error relating time table in relateTimetable function",
        "Please enter a valid time table id"
      );
    }
    //Validate the teacher Id
    if (
      isValidId(teacherId) == false ||
      (await TeacherScema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error relating time table in relateTimetable function",
        "Please provide a valid teacher Id"
      );
    }
    const timeTableRelation = await TeacherTimeTableRelationSchema.findOne({
      teacherId: teacherId,
    });
    //Check if the teacher is already having a time table or not
    if (timeTableRelation != null) {
      timeTableRelation.teacherId = teacherId;
      await timeTableRelation.save();
    } else {
      //Enter the details
      await TeacherTimeTableRelationSchema.create({
        timeTableId: timeTableId,
        teacherId: teacherId,
      });
    }

    return res.status(200).json({
      success: true,
      messege: "Time table added for this teacher successfully!",
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
  @desc: Get the time table for a particular teacher
  @access: Public
*/
exports.getTimeTableForTeacher = async (req, res, next) => {
  try {
    //Get the time table id and for which is it to relate from the url
    const { teacherId } = req.query;

    //Validate the teacher Id
    if (
      isValidId(teacherId) == false ||
      (await TeacherScema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching time table in getTimeTableForTeacher function",
        "Please provide a valid teacher Id"
      );
    }
    const timeTableRelation = await TeacherTimeTableRelationSchema.findOne({
      teacherId: teacherId,
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
            path: "dayTimeTable.className",
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
      "Error fetching a time table in getTimeTableForTeacher function",
      "Error fetching a time table"
    );
  }
};
