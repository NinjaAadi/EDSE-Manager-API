const client = require("../../redis/init_redis");
const errorHandler = require("../../error/error");

exports.clearCache = async (req, res, next) => {
  try {
    await client.del("Transports");
    await client.del("TransportsId");
    next();
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error inserting a address in addTransportAddress function",
      "Error adding an address. Please try again!"
    );
  }
};

/*
@desc: Add all transport types after geting it and returning the data from the server
*/
exports.addCache = async (req, res, next) => {
  try {
    //get the data from req obj
    const allTransports = req.allTransports;
    await client.set("Transports", JSON.stringify(allTransports));

    allTransports.map(async (transport) => {
      //Set the transport using hset
      await client.hSet(
        "TransportsId",
        transport._id.toString(),
        JSON.stringify(transport),
        (error) => {
          throw error;
        }
      );
    });

    //return response
    return res.status(200).json({
      success: true,
      data: allTransports,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error fetching all transport address in getAllTransportAddress function",
      "Error fetching all address. Please try again!"
    );
  }
};

/*
@desc: Get all cache for transports, if there are no cache then go to the main function
*/
exports.getAllCache = async (req, res, next) => {
  try {
    //Get all transports from the cache
    const allTransports = await client.get("Transports");

    //If there are no cache then go the the controller function
    if (allTransports == null || allTransports == undefined) return next();

    //return response
    return res.status(200).json({
      success: true,
      data: JSON.parse(allTransports),
    });
  } catch (error) {
    next();
  }
};
exports.getACache = async (req, res, next) => {
  try {
    const transportAddress = await client.hGet(
      "TransportsId",
      req.query.addressId.toString()
    );
    if (transportAddress == null || transportAddress == undefined) {
      return next();
    }
    return res.status(200).json({
      success: true,
      data: JSON.parse(transportAddress),
    });
  } catch (error) {
    next();
  }
};
