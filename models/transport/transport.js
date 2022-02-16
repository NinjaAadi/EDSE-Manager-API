const mongoose = require("mongoose");

const transportSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Transport", transportSchema);
