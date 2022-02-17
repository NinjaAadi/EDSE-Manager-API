const validateFile = (file) => {
  //If there is no file
  if (file == null) return false;

  //Check if the file is of type image or not
  if (file.mimetype.startsWith("image") == false) return false;
  
  //Check for the file size
  if (file.size > 2000000) return false;

  return true;
};

module.exports = validateFile;
