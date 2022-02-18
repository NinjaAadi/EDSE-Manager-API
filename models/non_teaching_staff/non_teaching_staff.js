const mongoose = require("mongoose");

const nonTeachingStaffSchema = mongoose.Schema({
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
  transportAddress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
    },
  ],
});

module.exports = mongoose.model(
  "nonTeachingStaffProfile",
  nonTeachingStaffSchema
);
