const mongoose = require("mongoose");

const isValidObjId = (id) => {
  return mongoose.isValidObjectId(id);
};

module.exports = isValidObjId;
