const mongoose = require("mongoose");

const studentProfile = new mongoose.Schema({
  profileImageURL: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  role: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  },
  birthDay: {
    type: Date,
    default: Date.now(),
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others", "None"],
    default: "None",
    required: true,
  },
  courses: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  transportAddress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
    },
  ],
  parentNumber: {
    type: String,
    trim: true,
    required: true,
  },
  fatherName: {
    type: String,
    trim: true,
    required: true,
  },
  motherName: {
    type: String,
    trim: true,
    required: true,
  },
  attendance: {
    type: [
      {
        day: String,
        isPresent: Boolean,
      },
    ],
    default: undefined,
  },
  className: {
    type: String,
  },
});
module.exports = mongoose.model("studentProfile", studentProfile);
