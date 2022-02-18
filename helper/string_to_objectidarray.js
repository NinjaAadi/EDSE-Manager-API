const mongoose = require("mongoose");

//Function to convert a string into an ObjectId
const convertToObjectId = (stringToChange) => {
  const splittedString = stringToChange.split(",");
  const objectArr = [];
  splittedString.forEach((item) =>
    objectArr.push(mongoose.Types.ObjectId(item))
  );
  return objectArr;
};

module.exports = convertToObjectId;
