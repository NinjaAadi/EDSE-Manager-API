const errorHandler = require("../../error/error");
const isValidId = require("../../validators/valid_objectid");
const { isValid } = require("../../validators/check_valid_value");
//Bring the class schema
const classSchema = require("../../models/class/class");

//Bring the student schema
const studentProfileSchema = require("../../models/student/student_profile");
//Bring the teacher schema
const teacherProfileSchema = require("../../models/teacher/teacher_profile");

/*
@desc: Create a class
@access: Private
*/
exports.createClass = async (req, res, next) => {
  try {
    //Get the teacher id and the students
    const { teacherId, students, name } = req.body;

    //Validate the name
    if (isValid(name) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a class in createClass function",
        "Pleaes provide a valid name of the class"
      );
    }
    //Validate the teachers
    if (
      isValidId(teacherId) == false ||
      (await teacherProfileSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a class in createClass function",
        "Please provide a valid teacher id"
      );
    }
    //Validate the students
    if (students == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a class in createClass function",
        "Please provide student list!",
        ""
      );
    }

    //New array to store the final students after validation
    const finalStudentList = [];
    for (let i = 0; i < students.length; i++) {
      const studentId = students[i];
      if (isValidId(studentId) == false)
        return await errorHandler(
          res,
          next,
          null,
          "Error adding a class in createClass function",
          "Please provide a valid student id!"
        );
      const studentProfile = await studentProfileSchema.findOne({
        _id: studentId,
      });

      //If someone is already present in class then do not enter it into the new class
      if (studentProfile != null) {
        //Check if he/she is already present in a class
        if (
          studentProfile.className != null &&
          studentProfile.className != ""
        ) {
          return await errorHandler(
            res,
            next,
            null,
            "Error adding a class in createClass function",
            `Student with id${studentId} already present in class ${studentProfile.className}!`
          );
        }
        //Change the class name
        studentProfile.className = name;
        await studentProfile.save();

        //Add the student to the final list
        finalStudentList.push(studentId);
      }
    }

    //Create the class

    const classObj = {
      name: name,
      teacher: teacherId,
      students: finalStudentList,
    };

    await classSchema.create(classObj);
    return res.status(200).json({
      success: true,
      messege: "Class created successfully",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding a class in createClass function",
      error.code == 11000
        ? "Class already present with this name"
        : "Error adding a class"
    );
  }
};

/*
@desc: Update a class teacher
@access: Private
*/
exports.updateTeacher = async (req, res, next) => {
  try {
    //Bring the class id and the teacher id
    const classId = req.query.classId;
    const teacherId = req.body.teacherId;
    //Validate the class id
    if (isValidId(classId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating teacher in updateTeacher function",
        "Please enter a valid class id"
      );
    }
    //Find the class
    const classProfile = await classSchema.findOne({ _id: classId });
    //Validate the teacher id
    if (
      isValidId(teacherId) == false ||
      (await teacherProfileSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating teacher in updateTeacher function",
        "Please enter a valid teacher id"
      );
    }
    //Edit the teacher
    classProfile.teacher = teacherId;
    await classProfile.save();

    //Return the result
    return res.status(200).json({
      success: true,
      messege: "Teacher updated for this class!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating teacher in updateTeacher function",
      "Error updating teacher for this class!"
    );
  }
};

/*
@desc: Update a class name
@access: Private
*/
exports.updateClassName = async (req, res, next) => {
  try {
    //Bring the classId from the url
    const classId = req.query.classId;

    //Bring the name
    const name = req.body.name;
    //Validate the class id
    if (isValidId(classId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating name of class in updateClassName function",
        "Please provide a valid class id"
      );
    }
    //Find the class profile
    const classProfile = await classSchema.findOne({ _id: classId });
    if (classProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating name of class in updateClassName function",
        "No class with this id present!"
      );
    }

    //Validate the name
    if (isValid(name) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating name of class in updateClassName function",
        "Please provide a valid name!"
      );
    }

    //Change the name and return the result
    classProfile.name = name;

    //For each student change the class name
    for (let i = 0; i < classProfile.students.length; i++) {
      const studentId = classProfile.students[i];

      //Find the student
      const studentProfile = await studentProfileSchema.findOne({
        _id: studentId,
      });

      //If someone is already present in class then do not enter it into the new class
      if (studentProfile != null) {
        //Change the class name
        studentProfile.className = name;
        await studentProfile.save();
      }
    }
    await classProfile.save();
    return res.status(200).json({
      success: true,
      messege: "Name for this class updated successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating name of class in updateClassName function",
      "Error updating the class name"
    );
  }
};
/*
@desc: Delete a class 
@access: Private
*/
exports.deleteClass = async (req, res, next) => {
  try {
    //Bring the class id from the URL
    const classId = req.query.classId;

    //Validate the class id
    if (isValidId(classId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a class in deleteClass function",
        "Please provide a valid class id"
      );
    }
    const classProfile = await classSchema.findOne({ _id: classId });

    //If there is no classProfile with this id
    if (classProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a class in deleteClass function",
        "No class with this id present!"
      );
    }
    //For each of the student delete the class from it
    for (let i = 0; i < classProfile.student.length; i++) {
      const studentId = classProfile.student[i];
      //Get the student profile
      const studentProfile = await studentProfileSchema.findOne({
        _id: studentId,
      });
      //Change the className to null
      studentProfile.className = "";
      await studentProfile.save();
    }

    //Return the result
    return res.status(200).json({
      success: true,
      messege: "Class deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting a class in deleteClass function",
      "Error deleting the class!"
    );
  }
};

/*
@desc: Get al classes by teacher's id
@access: Private
*/
exports.getClassByTeacherId = async (req, res, next) => {
  try {
    //Get the teacher id from the url
    const teacherId = req.query.teacherId;

    //Validate the teacher id
    if (
      isValidId(teacherId) == false ||
      (await teacherProfileSchema.findOne({ _id: teacherId })) == null
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching class in getClassByTeacherId function",
        "Please provide a valid teacher id"
      );
    }

    //Find the class and if there is no class then return that there is no class present
    const classProfiles = await classSchema
      .find({ teacher: teacherId })
      .populate("students", "fullName");

    //Return the result
    return res.status(200).json({
      success: true,
      data: classProfiles,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching class in getClassByTeacherId function",
      "Error fetching the class"
    );
  }
};

/*
@desc: Add a student to the class
@access: Private
*/
exports.addStudentToClass = async (req, res, next) => {
  try {
    //Get the class id from the url
    const classId = req.query.classId;

    //Get the student id
    const studentId = req.body.studentId;
    //Validate the classId
    if (isValidId(classId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding student to class in addStudentToClass function",
        "Please provide a valid class id"
      );
    }
    const classProfile = await classSchema.findOne({ _id: classId });

    //If there is no classProfile with this id
    if (classProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding student to class in addStudentToClass function",
        "No class with this id present!"
      );
    }

    //Validate the student id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding student to class in addStudentToClass function",
        "Please provide a valid student id"
      );
    }
    //Find the student id and validate the class i.e whether he/she is already present in a class
    const student = await studentProfileSchema.findOne({ _id: studentId });

    if (student.className != null && student.className != "") {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding student to class in addStudentToClass function",
        `Student with id ${student._id} is already present in class ${student.className}`
      );
    }

    //Add the student to the current class
    classProfile.students.push(studentId);
    student.className = classProfile.name;
    await student.save();
    await classProfile.save();
    //Return the result
    return res.status(200).json({
      success: true,
      messege: "Student added successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding student to class in addStudentToClass function",
      "Error adding student to the class"
    );
  }
};

/*
@desc: Remove a student to the class
@access: Private
*/
exports.deleteStudentFromClass = async (req, res, next) => {
  try {
    //Get the class id from the url
    const classId = req.query.classId;

    //Get the student id
    const studentId = req.body.studentId;
    //Validate the classId
    if (isValidId(classId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting student to class in deleteStudentFromClass function",
        "Please provide a valid class id"
      );
    }

    //Find the class profile
    const classProfile = await classSchema.findOne({ _id: classId });

    //If there is no classProfile with this id
    if (classProfile == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting student to class in deleteStudentFromClass function",
        "No class with this id present!"
      );
    }

    //Validate the student id
    if (isValidId(studentId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting student to class in deleteStudentFromClass function",
        "Please provide a valid student id"
      );
    }
    //Find the student id and validate the class i.e whether he/she is  present in this class or not
    const student = await studentProfileSchema.findOne({ _id: studentId });

    if (student.className == null || student.className != classProfile.name) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting student to class in deleteStudentFromClass function",
        `Student with id ${student._id} is not present in class ${student.className}`
      );
    }
    //Remove the student to the current class
    classProfile.students = classProfile.students.filter(
      (student) => student != studentId
    );
    await classProfile.save();

    //Update the student class Name
    student.className = "";
    await student.save();
    //Return the result
    return res.status(200).json({
      success: true,
      messege: "Student removed from the class successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting student to class in deleteStudentFromClass function",
      "Error deleting student to the class"
    );
  }
};
