const mongoose = require("mongoose");

const nonTeachingStaffSignUpSchema = mongoose.Schema({
  nonTeachingStaffId: {
    type: mongoose.Types.ObjectId,
    ref: "nonTeachingStaffProfile",
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "nonTeachingStaffSignUpData",
  nonTeachingStaffSignUpSchema
);
