const mongoose = require("mongoose");
const { profile } = require("../logger/logger");

const studentProfile = new mongoose.Schema({
  profileImage: {
    type: String,
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
    type: [String], //change: it is the role ref
    default: ["No role assigned."],
  },
  birthDay: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    default: "None",
    required: true,
  },
  class: {
    type: Number,
  },
  section: {
    type: String, //do change
  },
  subjects: {
    type: [String], //change : course ref
  },
  transportAddress: {
    type: String, //change : transport ref
  },
  parentNumber: {
    type: String,
    trim: true,
  },
  fatherName: {
    type: String,
    trim: true,
  },
  motherName: {
    type: String,
    trim: true,
  },
});
module.exports = mongoose.model("studentProfile", studentProfile);
