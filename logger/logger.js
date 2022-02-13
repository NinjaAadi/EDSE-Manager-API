const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const process = require('process');
//Custom format
const logFormat = printf(({ level, message, label, timestamp,stack }) => {
  return `PID = ${process.pid}, ${timestamp} [${label}] ${level}: ${stack || message}`;
});

const logger = createLogger({
  format: combine(
    format.colorize(),
    label({ label: "" }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
