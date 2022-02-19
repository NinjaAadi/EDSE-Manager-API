const fs = require("fs");

//Function to remove a file from the directory
const removeFile = async (fileName, pathToSave) => {
  const pathToFile = `${pathToSave}/${fileName}`;
  fs.unlinkSync(pathToFile);
};

module.exports = removeFile;
