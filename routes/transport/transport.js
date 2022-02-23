const express = require("express");
const { route } = require("express/lib/application");

const router = express.Router();

//Bring the controller functions
const {
  addTransportAddress,
  getAllTransportAddress,
  updateTransportAddress,
  deleteTransportAddress,
  getTransportAddressById,
  searchTransportAddress,
} = require("../../controllers/transport/transport");

//Bring the authorization functions
const auth = require("../../middlewares/admin_auth");

router.route("/addTransportAddress").post(auth, addTransportAddress);
router.route("/getAllTransportAddress").get(getAllTransportAddress);
router.route("/updateTransportAddress").put(auth, updateTransportAddress);
router.route("/deleteTransportAddress").delete(auth, deleteTransportAddress);
router.route("/getTransportAddress").get(getTransportAddressById);
router.route("/searchTransportAddress").get(searchTransportAddress);

module.exports = router;
