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

//Bring the caching middlewares
const {
  addCache,
  getAllCache,
  getACache,
  clearCache,
} = require("../../cache/transport/transport");

router
  .route("/addTransportAddress")
  .post(auth, clearCache, addTransportAddress);
router
  .route("/getAllTransportAddress")
  .get(getAllCache, getAllTransportAddress, addCache);
router
  .route("/updateTransportAddress")
  .put(auth, clearCache, updateTransportAddress);
router
  .route("/deleteTransportAddress")
  .delete(auth, clearCache, deleteTransportAddress);
router
  .route("/getTransportAddress")
  .get(getACache, getTransportAddressById, getACache);
router.route("/searchTransportAddress").get(searchTransportAddress);

module.exports = router;
