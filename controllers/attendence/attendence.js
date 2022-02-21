const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const getDate = require("../../helper/get_current_date");
//Import student Schema
const studentSchema = require("../../models/student/student_profile");

/*
@desc: Mark an student present
@access: Private
*/
exports.addAttendance = async (req, res, next) => {
  try {
    //Bring the student id from the url
    const studentId = req.query.studentId;

    //Validate the id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding attendance in addAttendance function",
        "Please provide a valid student Id"
      );
    }

    //Find the profile
    const studentProfile = await studentSchema.findOne({ _id: studentId });

    //If there is no profile present with this id
    if (studentProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding attendance in addAttendance function",
        "No student with this id present!"
      );
    }

    //Mark the attendance present for the current day
    //Before that check if the current day is present in the object array

    //If there is no array of attendance present
    if (studentProfile.attendance == null) {
      studentProfile.attendance = [];
    }
    const todayFound = studentProfile.attendance.some(
      (dates) => dates.day === getDate()
    );
    if (todayFound == false)
      studentProfile.attendance.push({ day: getDate(), isPresent: true });

    //Update the attencance
    studentProfile.attendance.map((dates) => {
      if (dates.day == getDate()) {
        dates.isPresent = true;
      }
      return;
    });

    //Save the student profile
    await studentProfile.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Attendance updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding attendance in addAttendance function",
      "Error adding a student attendance!"
    );
  }
};

/* 
@desc: Mark a student absent
@access: Private
*/

exports.deleteAttendance = async (req, res, next) => {
  try {
    //Bring the student id from the url
    const studentId = req.query.studentId;

    //Validate the id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting attendance in deleteAttendance function",
        "Please provide a valid student Id"
      );
    }

    //Find the profile
    const studentProfile = await studentSchema.findOne({ _id: studentId });

    //If there is no profile present with this id
    if (studentProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting attendance in deleteAttendance function",
        "No student with this id present!"
      );
    }

    //Mark the attendance absent for the current day
    //Before that check if the current day is present in the object array

    //If there is no array of attendance present
    if (studentProfile.attendance == null) {
      studentProfile.attendance = [];
    }

    const todayFound = studentProfile.attendance.some(
      (dates) => dates.day === getDate()
    );
    if (todayFound == false)
      studentProfile.attendance.push({ day: getDate(), isPresent: false });

    //Update the attencance
    studentProfile.attendance.map((dates) => {
      if (dates.day == getDate()) {
        dates.isPresent = false;
      }
      return;
    });

    //Save the student profile
    await studentProfile.save();

    //return the result
    return res.status(200).json({
      success: true,
      messege: "Attendance updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting attendance in deleteAttendance function",
      "Error deleting a student attendance!"
    );
  }
};
