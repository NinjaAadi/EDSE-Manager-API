const mongoose = require("mongoose");

const daySchema = mongoose.Schema({
  name: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    unique: true,
  },
});

module.exports = mongoose.model("Days", daySchema);
