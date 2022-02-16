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

router.route("/addTransportAddress").post(addTransportAddress);
router.route("/getAllTransportAddress").get(getAllTransportAddress);
router.route("/updateTransportAddress").post(updateTransportAddress);
router.route("/deleteTransportAddress").delete(deleteTransportAddress);
router.route("/getTransportAddress").get(getTransportAddressById);
router.route("/searchTransportAddress").get(searchTransportAddress);

module.exports = router;
