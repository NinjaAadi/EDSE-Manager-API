const isValidId = require("./valid_objectid");

/*Helper function specific to time table*/
const isValidTimeTable = (timeTable) => {
  for (var i = 0; i < timeTable.length; i++) {
    //validate the day id
    if (isValidId(timeTable[i].dayName) == false) return false;
    for (var j = 0; j < timeTable[i].dayTimeTable.length; j++) {
      //Get all the time id and the course id
      const timeId = timeTable[i].dayTimeTable[j].time;
      const courseId = timeTable[i].dayTimeTable[j].subject;

      //Validate the time and course ids.
      if (isValidId(timeId) == false || isValidId(courseId) == false)
        return false;
    }
  }
  return true;
};

module.exports = isValidTimeTable;
