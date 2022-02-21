const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  student: {
    type: mongoose.Types.ObjectId,
    ref: "studentProfile",
  },
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: "teacherProfile",
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model("reviews", reviewSchema);
