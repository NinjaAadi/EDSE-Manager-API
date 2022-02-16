const logger = require("../logger/logger");
//Custom module for handling errors
const sendError = async (res, next, err, consoleMsg, responseMsg) => {
  logger.error(new Error(consoleMsg, err));
  return res.status(400).json({
    success: false,
    messege: responseMsg,
  });
};

module.exports = sendError;
