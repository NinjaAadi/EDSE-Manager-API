const mongoose = require("mongoose");

const timeSchema = mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    unique: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Time", timeSchema);
