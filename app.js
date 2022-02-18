//Naming conventions
//For files and folders ---> smaller + underscore
//For variables ---> lower + upperCase Start

const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const env = require("dotenv").config({ path: path.join(__dirname, ".env") });
const logger = require("./logger/logger");
const cluster = require("cluster");
const os = require("os");

//Connect to the database
const connectDb = require("./database/database_mongodb");
connectDb();

const app = express();

//Middleware function for file upload
app.use(fileUpload());

/*Middleware function to use request.body */
app.use(express.json());

//import all the route files
const studentProfileRoute = require("./routes/student/student_profile");
const teacherProfileRoute = require("./routes/teacher/teacher_profile");
const nonTeachingStaffProfileRoute = require("./routes/non_teaching_staff/non_teaching_staff_profile");
const roleRoute = require("./routes/role/role");
const courseRoute = require("./routes/course/course");
const transportRoute = require("./routes/transport/transport");
//routes
app.use(`/${process.env.API_INITIAL_URL}profile/student/`, studentProfileRoute);
app.use(`/${process.env.API_INITIAL_URL}profile/teacher/`, teacherProfileRoute);
app.use(
  `/${process.env.API_INITIAL_URL}profile/nonTeachingStaff/`,
  nonTeachingStaffProfileRoute
);
app.use(`/${process.env.API_INITIAL_URL}role/`, roleRoute);
app.use(`/${process.env.API_INITIAL_URL}course/`, courseRoute);
app.use(`/${process.env.API_INITIAL_URL}transport/`, transportRoute);

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
