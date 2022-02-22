const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");

//Function to get a jwt token
//Format of object
/*
    {
        id:mongoose.Types.ObjectId,
        for:["Student","Teacher","NonTeachingStaff"]
    }
*/
exports.getToken = (object) => {
  //Generate a token
  const token = jwt.sign(object, process.env.JWT_SECRET, { expiresIn: "100h" });
  return token;
};

exports.getObject = async (token) => {
  //Get the object
  /*Verify the token */
  const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
  if (decodedObj == null) return null;
  return decodedObj;
};
