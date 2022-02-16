const errorHandler = require("../../error/error");
const checkValid = require("../../validators/check_valid_value");
const isValidId = require("../../validators/valid_objectid");
//Import the model
const transportSchema = require("../../models/transport/transport");

/*
@desc: Add a transport address
@access: Private
*/
exports.addTransportAddress = async (req, res, next) => {
  try {
    const { address, pinCode } = req.body; //Fetch the details of the transport from the body
    const transportObj = { address, pinCode }; //Create the object

    //Validate all the fields
    if (checkValid(address) == false || checkValid(pinCode) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a address in addTransportAddress function",
        "Invalid address details! Please try again."
      );
    }

    //Insert into the database
    const transport = await transportSchema.create(transportObj);

    //Return success
    return res.status(200).json({
      success: true,
      messege: "Address inserted successfully",
    });
  } catch (error) {
    console.log(error);
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
@desc: Get all transport address
@access: Public
*/
exports.getAllTransportAddress = async (req, res, next) => {
  try {
    //Fetch from the db
    const allTransport = await transportSchema.find();

    //return response
    return res.status(200).json({
      success: true,
      data: allTransport,
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
@desc: Update a transport address
@access: Private
*/
exports.updateTransportAddress = async (req, res, next) => {
  try {
    const transportAddressId = req.query.addressId;
    const { address, pinCode } = req.body;
    const transportAddressObj = { address, pinCode };

    //Validate the id
    if (
      isValidId(transportAddressId) == false ||
      checkValid(transportAddressId) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating the transport address in updateTransportAddress function",
        "Please provide a valid address id"
      );
    }

    //Validate all the fields
    if (checkValid(address) == false || checkValid(pinCode) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a address in updateTransportAddress function",
        "Invalid address details! Please try again!"
      );
    }

    //Update the field
    const transportAddressToUpdate = await transportSchema.findByIdAndUpdate(
      transportAddressId,
      transportAddressObj
    );
    //If there is no course with this id then return error
    if (transportAddressToUpdate == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error updating a transport addres in updateTransportAddress function",
        "No transport address with this id present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      messege: "Address details updated sucessfully",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error updating a transport addres in updateTransportAddress function",
      "Error updating the address. Please try again!"
    );
  }
};

/*
@desc: Delete a transport address
@access: Private 
*/
exports.deleteTransportAddress = async (req, res, next) => {
  try {
    //Get the id
    const transportAddressId = req.query.addressId;

    //Validate the id
    if (
      isValidId(transportAddressId) == false ||
      checkValid(transportAddressId) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting the address in deleteTransportAddress function",
        "Please provide a valid address id"
      );
    }

    //Delete the course
    const transportAddressToDelete = await transportSchema.findByIdAndDelete(
      transportAddressId
    );

    //If there is no course with this id present
    if (transportAddressToDelete == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting the address in deleteTransportAddress function",
        "No address with this id is present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      messege: "Transport address deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting the address in deleteTransportAddress function",
      "Error deleting the address. Please try again!"
    );
  }
};
/*
@desc: Get a transport address by id
@access: Public
*/
exports.getTransportAddressById = async (req, res, next) => {
  try {
    //Get the id
    const transportAddressId = req.query.addressId;

    //Validate the id
    if (
      isValidId(transportAddressId) == false ||
      checkValid(transportAddressId) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting the address in getTransportAddressById function",
        "Please provide a valid address id"
      );
    }

    //Get the course
    const transportAddress = await transportSchema.findById(transportAddressId);

    //If there is no course with this id present
    if (transportAddress == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error getting a address in getTransportAddressById function",
        "No address with this id is present. Please try again!"
      );
    }
    return res.status(200).json({
      success: true,
      data: transportAddress,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting a address in getTransportAddressById function",
      "Error getting the address. Please try again!"
    );
  }
};

/*
@desc: Search all the address with given pin code
@access: Public
 */
exports.searchTransportAddress = async (req, res, next) => {
  try {
    //Get the pincode
    const pinCode = req.query.pinCode;

    //Validate the pincode
    if (checkValid(pinCode) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error searching for a address in searchTransportAddress function",
        "Please provide a valid pincode"
      );
    }
    //Fetch address with similar pincode
    const addressWithSimilarPinCode = await transportSchema.find({
      pinCode: pinCode,
    });

    //Return result
    return res.status(200).json({
      success: true,
      data: addressWithSimilarPinCode,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error searching for  a address in searchTransportAddress function",
      "Error searching for the given pincode. Please try again later"
    );
  }
};
