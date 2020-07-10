// winston logger module for logging
const winston = require("winston");
const { LogstashTransport } = require("winston-logstash-transport");
require("dotenv").config();
const lodash = require("lodash");

//  Middleware - winston logging - API tracing - Before/After API call
const customFormat = winston.format.printf((info) => {
  let { level, message, label, timestamp, stack } = info;

  if (lodash.isObject(message)) {
    message = JSON.stringify(message);
  }
  /* This will get the data from splat object and 
  then joins with the rest of the parameters
  */
  const args = info[Symbol.for("splat")] || [];
  const strArgs = args
    .map((value) => {
      if (lodash.isObject(value)) {
        return JSON.stringify(value);
      }
      return value;
    })
    .join(" ");

  // *Check for the error instance and print the error stack trace.
  if (info instanceof Error) {
    // *print error stack trace
    return `${timestamp} [${label}] ${level}: ${message} - ${stack}`;
  }

  return `${timestamp} [${label}] ${level}: ${message} ${strArgs}`;
});

const logger = winston.createLogger({
  // winston format combine for multiple formats
  format: winston.format.combine(
    // * For complete error stack trace
    // winston.format.errors({ stack: true }),
    winston.format.label({ label: "winston-logger" }),
    winston.format.timestamp(),
    // !Below formats are not useful when using custom format
    // winston.format.json(),
    // winston.format.prettyPrint(),
    // winston.format.align(),
    // winston.format.splat(),
    customFormat
  ),
  // Transport for exporting data
  transports: [
    // console logger
    new winston.transports.Console(),
    // logstash logger
    new LogstashTransport({
      host: process.env.ELK_HOST,
      port: process.env.ELK_PORT,
    }),
    // file logger
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
    }),
  ],
});

const Middleware = function (req, res, next) {
  var req_data = {
      message: "Before call",
      url: req.url,
      method: req.method,
      requestID: req.id,
      requestBody: req.body,
    },
    res_data;
  // winston logger - Before API call
  logger.info(req_data);

  // listeners for response object
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(new Buffer(chunk));
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(new Buffer(chunk));
    var body = Buffer.concat(chunks).toString("utf8");
    res_data = {
      message: "After call",
      url: req.url,
      method: req.method,
      requestID: req.id,
      responseBody: Buffer.isBuffer(body) ? "file" : body,
      statusCode: res.statusCode,
    };
    // winston logger - After API call
    logger.info(res_data);

    oldEnd.apply(res, arguments);
  };
  next();
};

module.exports = { Middleware, logger };
