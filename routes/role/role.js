const express = require("express");
const router = express.Router();

//Import the controller function
const {
  addRole,
  getAllRoles,
  updateRole,
  deleteRole,
  getRoleById,
} = require("../../controllers/role/role");
//Routes
router.route("/addRoleValue").post(addRole);
router.route("/deleteRoleValue").delete(deleteRole);
router.route("/updateRoleValue").post(updateRole);
router.route("/getRole").get(getRoleById);
router.route("/getAllRole").get(getAllRoles);

module.exports = router;
