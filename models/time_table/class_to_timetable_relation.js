const mongoose = require("mongoose");

const TimeTableClassRelation = mongoose.Schema({
  timeTableId: {
    type: mongoose.Types.ObjectId,
    ref: "timeTable",
  },
  classId: {
    type: mongoose.Types.ObjectId,
    ref: "classDetails",
  },
});

module.exports = mongoose.model(
  "timeTableClassRelation",
  TimeTableClassRelation
);
