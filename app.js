//Naming conventions
//For files and folders ---> smaller + underscore
//For variables ---> lower + upperCase Start

const express = require("express");
const path = require("path");
const env = require("dotenv").config({ path: path.join(__dirname, ".env") });
const logger = require("./logger/logger");
const cluster = require("cluster");
const os = require("os");

//Connect to the database
const connectDb = require("./database/database_mongodb");
connectDb();
const app = express();

/*Middleware function to use request.body */
app.use(express.json());

//import all the route files
const studentProfile = require("./routes/student/student_profile");
const Role = require("./routes/role/role");

//routes
app.use(`/${process.env.API_INITIAL_URL}profiles/student`, studentProfile);
app.use(`/${process.env.API_INITIAL_URL}role/`, Role);

//Create the clusters
// const numCpu = os.cpus().length;
// if (cluster.isMaster) {
//   for (let i = 0; i < numCpu; i++) {
//     cluster.fork();
//   }
// } else {
//   app.listen(process.env.PORT, () => {
//     logger.info("App running in port " + process.env.PORT);
//   });
// }
app.listen(process.env.PORT, () => {
  logger.info("App running in port " + process.env.PORT);
});
