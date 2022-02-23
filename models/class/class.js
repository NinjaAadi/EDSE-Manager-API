const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: "teacherProfile",
  },
  students: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "studentProfile",
      },
    ],
    default: undefined,
  },
});

module.exports = mongoose.model("classDetails", classSchema);
