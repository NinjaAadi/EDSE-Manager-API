const errorHandler = require("../error/error");
const isValidId = require("../validators/valid_objectid");
const { getObject } = require("../helper/jwt");
//Bring the student schema
const studentProfileSchema = require("../models/student/student_profile");
//Bring the teacher schema
const teacherProfileSchema = require("../models/teacher/teacher_profile");
//Bring the non teaching staff schema
const nonTeachingStaffProfileSchema = require("../models/non_teaching_staff/non_teaching_staff");
//Bring the role schema
const roleSchema = require("../models/role/role");

const rolesToAccess = ["Class Teacher", "Admin"];

const authorize = async (req, res, next) => {
  try {
    //Bring the jwt token
    const token = req.header("auth-token");
    //If there is no token then return
    if (token == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error in authorization for admin! No token received",
        "You are not authorized to use this route"
      );
    }
    const decodedObj = getObject(token);
    if (decodedObj == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error in authorization for admin",
        "You are not authorized to use this route"
      );
    }
    let roles;
    if (decodedObj.for == "Student") {
      //If it is from student then set the role
      const studentProfile = await studentProfileSchema.findOne({
        _id: decodedObj.id,
      });
      if (studentProfile != null) {
        roles = studentProfile.role;
      }
    } else if (decodedObj.for == "Teacher") {
      //If it is from the teacher then set the role
      const teacherProfile = await teacherProfileSchema.findOne({
        _id: decodedObj.id,
      });
      if (teacherProfile != null) {
        roles = teacherProfile.role;
      }
    } else if (decodedObj.for == "NonTeachingStaff") {
      //If it is from non teaching staff then set the role
      const nonTeachingStaff = await nonTeachingStaffSchema.findOne({
        _id: decodedObj.id,
      });
      if (nonTeachingStaff != null) {
        roles = nonTeachingStaff.role;
      }
    }
    if (roles == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error in authorization",
        "Unauthorized to use this route"
      );
    }
    //Validate the role
    for (let i = 0; i < roles.length; i++) {
      const roleId = roles[i];
      const role = await roleSchema.findOne({ _id: roleId });
      if (rolesToAccess.includes(role.title)) {
        return next();
      }
    }
    return res.status(401).json({
      success: false,
      messege: "Unauthorized to use this route!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error in authorization for admin",
      "Error in authorization"
    );
  }
};

module.exports = authorize;
