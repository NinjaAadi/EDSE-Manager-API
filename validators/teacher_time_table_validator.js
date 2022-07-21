const isValidId = require("./valid_objectid");

/*Helper function specific to teacher time table */

const isValidTimeTable = (timeTable) => {
  for (var i = 0; i < timeTable.length; i++) {
    //Validate the day id
    if (isValidId(timeTable[i].dayName) == false) return false;
    for (var j = 0; j < timeTable[i].dayTimeTable.length; j++) {
      const timeId = timeTable[i].dayTimeTable[j].time;
      const courseId = timeTable[i].dayTimeTable[j].subject;
      const classId = timeTable[i].dayTimeTable[j].className;

      //Validate the timeId, courseId, and the classId
      if (isValidId(timeId) == false) {
        return false;
      }
      if (courseId == "" && classId == "") continue;
      if (courseId == "" || classId == "") {
        return false;
      }
    }
  }
  return true;
};
module.exports = isValidTimeTable;
