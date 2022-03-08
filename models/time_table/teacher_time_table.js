const mongoose = require("mongoose");

const TeacherTimeTableSchema = mongoose.Schema({
  timeTable: {
    type: [
      {
        dayName: {
          type: mongoose.Types.ObjectId,
          ref: "Days",
        },
        dayTimeTable: {
          type: [
            {
              time: { type: mongoose.Types.ObjectId, ref: "Time" },
              className: { type: mongoose.Types.ObjectId, ref: "classDetails" },
              subject: { type: mongoose.Types.ObjectId, ref: "Course" },
            },
          ],
          default: undefined,
        },
      },
    ],
    default: undefined,
  },
});

module.exports = mongoose.model("teacherTimeTable", TeacherTimeTableSchema);
