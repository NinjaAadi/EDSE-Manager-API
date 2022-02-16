//Validator function to check if a string is empty or not and has a desired length or not
const checkValue = (toCheck, lengthDesired) => {
  if (toCheck == null) return false;
  if (toCheck.length == 0) return false;
  if (lengthDesired != null) {
    if (toCheck.length < lengthDesired) return false;
  }
  return true;
};
module.exports = checkValue;
