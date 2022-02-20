//Validator function to check if a string is empty or not and has a desired length or not
exports.isValid = (toCheck, lengthDesired) => {
  if (toCheck == null) return false;
  if (toCheck.length == 0) return false;
  if (lengthDesired != null) {
    if (toCheck.length < lengthDesired) return false;
  }
  return true;
};

//Validate gender
exports.validGender = (gender) => {
  const values = ["Male", "Female", "Others", "None"];
  if (values.includes(gender)) return true;
  return false;
};

//Validate date
exports.validDate = (date) => {
  if (new Date(parseInt(date)) == "Invalid Date") return false;
  return true;
};

//Helper function for if an array contains a value or not
exports.isPresentinArray = (target, targetArray) => {
  if (targetArray.includes(target) == false || target == null) {
    return false;
  }
  return true;
};

//Helper functions for checking that it is a valid time format or not
exports.isValidTimeString = (timeStr) => {
  if (timeStr == null) return false;
  //Time regular expression
  const timeRegExp = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegExp.test(timeStr);
};

//Function for checking a valid time stamp
exports.isValidTimeStamp = (startTime, endTime) => {
  const start = parseInt(startTime.substring(0, 2));
  const end = parseInt(endTime.substring(0, 2));
  console.log(start, end);
  if (start > end) return false;
  return true;
};
