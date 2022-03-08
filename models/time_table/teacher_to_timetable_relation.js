const mongoose = require("mongoose");

const TimeTableTeacherRelation = mongoose.Schema({
  timeTableId: {
    type: mongoose.Types.ObjectId,
    ref: "teacherTimeTable",
  },
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teacherProfile",
  },
});

module.exports = mongoose.model(
  "timeTableTeacherRelation",
  TimeTableTeacherRelation
);
