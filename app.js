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
const noticeRoute = require("./routes/notice/notice");
const dayRoute = require("./routes/day/day");
const timeRoute = require("./routes/time/time");
const timeTableRoute = require("./routes/time_table/time_table");
const attendanceRoute = require("./routes/attendance/attendance");
const reviewRoute = require("./routes/review/review");
const studentSignUpRoute = require("./routes/signup/student_signup");
const teacherSignUpRoute = require("./routes/signup/teacher_signup");
const nonTeachingStaffSignUpRoute = require("./routes/signup/non_teaching_staff");
const studentLoginRoute = require("./routes/login/student_login");
const teacherLoginRoute = require("./routes/login/teacher_login");
const nonTeachingStaffLoginRoute = require("./routes/login/non_teaching_staff_login");
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
app.use(`/${process.env.API_INITIAL_URL}notice/`, noticeRoute);
app.use(`/${process.env.API_INITIAL_URL}day/`, dayRoute);
app.use(`/${process.env.API_INITIAL_URL}time/`, timeRoute);
app.use(`/${process.env.API_INITIAL_URL}timeTable/`, timeTableRoute);
app.use(`/${process.env.API_INITIAL_URL}attendance/`, attendanceRoute);
app.use(`/${process.env.API_INITIAL_URL}review/`, reviewRoute);
app.use(`/${process.env.API_INITIAL_URL}signUp/`, studentSignUpRoute);
app.use(`/${process.env.API_INITIAL_URL}signUp/`, teacherSignUpRoute);
app.use(`/${process.env.API_INITIAL_URL}signUp/`, nonTeachingStaffSignUpRoute);
app.use(`/${process.env.API_INITIAL_URL}login/`, studentLoginRoute);
app.use(`/${process.env.API_INITIAL_URL}login/`, teacherLoginRoute);
app.use(`/${process.env.API_INITIAL_URL}login/`, nonTeachingStaffLoginRoute);

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
