const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  for: {
    type: String,
    enum: ["Student", "Teacher", "NonTeachingStaff", "Admin"],
  },
});

module.exports = mongoose.model("Role", roleSchema);
