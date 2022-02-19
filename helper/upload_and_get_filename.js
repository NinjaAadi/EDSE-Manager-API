const fs = require("fs");
const path = require("path");

const uploadAndGetFileName = async (image, id, pathToSave) => {
  console.log(image);
  const fileName = `${id}${path.parse(image.name).ext}`;
  console.log(fileName);
  //Set the image name to the modified name value
  image.name = fileName;

  //Move to the directory
  image.mv(`${pathToSave}/${image.name}`, async (err) => {
    if (err) console.log(err);
  });

  return fileName;
};

module.exports = uploadAndGetFileName;
