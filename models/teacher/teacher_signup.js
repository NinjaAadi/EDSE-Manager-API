const mongoose = require("mongoose");

const teacherSignupSchema = mongoose.Schema({
  teacherId: {
    type: mongoose.Types.ObjectId,
    ref: "teacherProfile",
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("teacherSignUpData", teacherSignupSchema);
