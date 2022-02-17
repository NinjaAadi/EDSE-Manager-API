const fs = require("fs");

//Function to remove a file from the directory
const removeFile = async (fileName) => {
  const pathToFile = `${process.env.FILE_UPLOAD_PATH}/${fileName}`;
  fs.unlinkSync(pathToFile);
};

module.exports = removeFile;
