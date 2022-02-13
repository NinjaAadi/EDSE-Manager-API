const express = require("express");
const path = require("path");
const env = require("dotenv").config({ path: path.join(__dirname, ".env") });
const logger = require("./logger/logger");
const cluster = require("cluster");
const os = require("os");

const app = express();

//Create the clusters
const numCpu = os.cpus().length;
if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
} else {
  app.listen(process.env.PORT, () => {
    logger.info("App running in port " + process.env.PORT);
  });
}
