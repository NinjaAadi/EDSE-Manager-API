const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema({
  noticeImageURL: {
    type: String,
    required: true,
    default: "",
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    enum: ["Student", "Teacher", "All", "NonTeachingStaff"],
  },
  signedBy: {
    type: mongoose.Types.ObjectId,
    ref: "teacherProfile",
  },
});

module.exports = mongoose.model("notice", noticeSchema);
