const errorHandler = require("../../error/error");
const { isPresentinArray } = require("../../validators/check_valid_value");
const isValidId = require("../../validators/valid_objectid");
//Import the day schema
const daySchema = require("../../models/day/day");

/*
@desc: Add a day
@acccess: Private
*/
exports.addDay = async (req, res, next) => {
  try {
    //Get the day to add
    const dayToAdd = req.body.dayName;

    //Validate the day name
    if (
      isPresentinArray(dayToAdd, [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]) == false
    ) {
      return await errorHandler(
        res,
        next,
        null,
        "Error adding a day in addDay function",
        "Please enter a valid day name"
      );
    }
    //Add to the database
    const day = await daySchema.create({ name: dayToAdd });

    return res.status(200).json({
      success: true,
      messege: "Day inserted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error adding day in addDay function",
      error.code == 11000
        ? "There already exists a day with this name"
        : "Error adding day!"
    );
  }
};

/*
@desc: Get all days
@acccess: public
*/
exports.getAllDays = async (req, res, next) => {
  try {
    //Fetch all the days from the database
    const allDays = await daySchema.find();
    return res.status(200).json({
      success: true,
      data: allDays,
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error getting all days in getAllDays function",
      "Error fetching all days values!"
    );
  }
};

/*
@desc: Delete a day
@acccess: Private
*/
exports.deleteDay = async (req, res, next) => {
  try {
    //Get the day to add
    const dayId = req.query.dayId;

    //Validate the id
    if (isValidId(dayId) == false) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a day in deleteDay function",
        "Please provide a valid day id"
      );
    }

    //Delete the day from the database
    const dayToDelete = await daySchema.findOneAndDelete({ _id: dayId });

    //If no id is present then return false
    if (dayToDelete == null) {
      return await errorHandler(
        res,
        next,
        null,
        "Error deleting a day in deleteDay function",
        "No day with this id present!"
      );
    }

    return res.status(200).json({
      success: true,
      messege: "Day deleted successfully!",
    });
  } catch (error) {
    return await errorHandler(
      res,
      next,
      error,
      "Error deleting day in deleteDay function",
      "Error deleting day!"
    );
  }
};
