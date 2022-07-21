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

//Bring the authorization functions
const auth = require("../../middlewares/admin_teacher_auth");
//Routes
router.route("/addRoleValue").post(addRole);
router.route("/deleteRoleValue").delete(auth, deleteRole);
router.route("/updateRoleValue").put(auth, updateRole);
router.route("/getRole").get(getRoleById);
router.route("/getAllRole").get(getAllRoles);

module.exports = router;
