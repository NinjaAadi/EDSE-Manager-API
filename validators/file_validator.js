const validateFile = (file) => {
  //If there is no file
  if (file == null) return false;
  const filename = file.name;
  console.log(filename);
  const regex = /.(jpg|jpeg|png|gif)$/i;
  const isGood = regex.test(filename);
  //Check if the file is of type image or not
  if (isGood == false) return false;

  if (file.size > 10000000)
    //Check for the file size
    return false;
  return true;
};
 
module.exports = validateFile; 
