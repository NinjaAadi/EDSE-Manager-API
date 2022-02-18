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
