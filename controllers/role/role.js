const errorHandler = require("../../error/error");
const checkValid = require("../../validators/check_valid_value");
const isValidId = require("../../validators/valid_objectid");
//import the model
const roleSchema = require("../../models/role/role");

/*
@desc: Add a role value
@access: Private
*/
exports.addRole = async (req, res, next) => {
  try {
    //Add the role value
    const role = req.body.title;
    const roleFor = req.query.roleFor;
    const roleObj = { title: role, for: roleFor };

    //Validate for the role for
    if (validateRoleType(roleFor) == false) {
      return returnError(res, next);
    }
    //Validate the title
    if (checkValid(role) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error in adding role. Please check the role",
        "Please enter a valid role value."
      );
    }

    //Insert into the database
    await roleSchema.create(roleObj);
    return res.status(200).json({
      success: true,
      messege: "Role created successfully!",
    });
  } catch (error) {
    await errorHandler(
      res,
      next,
      error,
      "Error adding the role value in function addRole function",
      error.code == 11000 //This error code is for duplicate entries in mongoDb
        ? "A role with this title already exists."
        : "Error adding role."
    );
  }
};
/*
@desc: Get all the roles
@access: Public
*/
exports.getAllRoles = async (req, res, next) => {
  try {
    //Get from the url of which type to get
    let roleFor = req.query.roleFor;

    //If roleFor is null then we by default it is for the student
    if (roleFor == null) roleFor = "Student";

    //Fetch from the database
    const Roles = await roleSchema.find({ for: roleFor });
    return res.status(200).json({
      success: true,
      data: Roles,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching the values in function getAllRoles",
      "Error fetching roles. Please try again!"
    );
  }
};
/*
@desc: Update a role
@access: Private
*/
exports.updateRole = async (req, res, next) => {
  try {
    //Fetch the id and the title from the url parameter
    const roleId = req.query.roleId;
    const title = req.body.title;

    //Validate the id
    if (
      checkValid(roleId) == false ||
      checkValid(title) == false ||
      isValidId(roleId) == false //if it is a valid mongoose object id or not
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating the value in function updateRole for student",
        "Please provide valid role id or valid title!"
      );
    }

    //Check if the id is present in the database or not
    const roleToUpdate = await roleSchema.findById(roleId);
    if (roleToUpdate == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating the value in function updateRole for student",
        "No role with this id is present!"
      );
    }

    //Update the role
    roleToUpdate.title = title;
    await roleToUpdate.save();

    return res.status(200).json({
      success: true,
      messege: "Role updated successfully",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating the values in function updateRole",
      "Error updating role. Please try again!"
    );
  }
};
/*
@desc: Delete a role
@access: Private
*/
exports.deleteRole = async (req, res, next) => {
  try {
    //Fetch the id and the for from the url parameter
    const roleId = req.query.roleId;

    //Validate the id
    if (
      checkValid(roleId) == false ||
      isValidId(roleId) == false //if it is a valid mongoose object id or not
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleteing the role in deleteRole",
        "Please provide valid role id or valid title!"
      );
    }

    //Check if the id is present in the database or not
    const roleToDelete = await roleSchema.findByIdAndDelete(roleId);

    //If not present
    if (roleToDelete == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting the value in function deleteRole",
        "No role with this id is present!"
      );
    }

    return res.status(200).json({
      success: true,
      messege: "Role deleted sucessfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting the values in function deleteRole",
      "Error deleting role. Please try again!"
    );
  }
};
/*
@desc: Get a specific role
@access: Public
*/
exports.getRoleById = async (req, res, next) => {
  try {
    //Fetch the id and the title from the url parameter
    const roleId = req.query.roleId;

    //Validate the id
    if (
      checkValid(roleId) == false ||
      isValidId(roleId) == false //if it is a valid mongoose object id or not
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting the role in getRole function",
        "Please provide valid role id!"
      );
    }

    //Fetch from the database
    const roleById = await roleSchema.findById({ _id: roleId });

    //If the role with this id is not availale
    if (roleById == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error fetching the value in function getRoleById",
        "No role with this id exists!Please provide a valid id!"
      );
    }
    return res.status(200).json({
      success: true,
      data: roleById,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching the value in function getRoleById",
      "Error fetching role. Please try again!"
    );
  }
};

//Helper function for role type validation
const validateRoleType = (roleFor) => {
  const roleForOption = ["Student", "Teacher", "NonTeachingStaff", "Admin"];
  if (roleForOption.includes(roleFor) == false || roleFor == null) {
    return false;
  }
  return true;
};

//Helper function to return an error if the role type is not valid
const returnError = async (res, next) => {
  return await errorHandler(
    res,
    next,
    null,
    "Error in adding student role. Please check the role type",
    "Please enter a valid role type."
  );
};

//Helper function to return an error if the role id is not valid
