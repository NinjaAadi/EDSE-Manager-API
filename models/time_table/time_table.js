const mongoose = require("mongoose");

//Warning: This is a very complicated schema, please read it properly
const timeTableSchema = mongoose.Schema({
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
module.exports = mongoose.model("timeTable", timeTableSchema);
// {
//   dayName: {
//     type: mongoose.Types.ObjectId,
//     ref: "Days",
//   },

// },
