const mongoose = require("mongoose");

const studentSignUpSchema = mongoose.Schema({
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: "studentProfile",
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("studentSignUpData", studentSignUpSchema);
