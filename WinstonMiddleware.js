// winston logger module for logging
const winston = require("winston"); 
const logstashTCP = require("./logstash")
//  Middleware - winston logging - API tracing - Before/After API call
const logger = winston.createLogger({
  // winston format combine for multiple formats
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.label({ label: "winston-logger" }),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.align()
  ),
  // Transport for exporting data
  transports: [
    // logging in console
    new winston.transports.Console(),

    // logging into a file
    // new winston.transports.File({
    //     filename: 'combined.log',
    //     level: 'info'
    //   }),

    /* we can also add custom transport such as logstashTCP for sending the logs to logstash using the winston logs */
  ],
});

module.exports =  function (req, res, next) {

  var data1={
    url: req.url,
    method: req.method,
    requestID: req.id,
    requestBody: req.body,
  },data2;
  // winston logger - Before API call
  logger.info("Before call", data1);

  // send logs to logstash
   logstashTCP(data1)

  // listeners for response object
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(new Buffer(chunk));
    oldWrite.apply(res, arguments);
  };

  res.end =  function (chunk) {
    if (chunk) chunks.push(new Buffer(chunk));
    var body = Buffer.concat(chunks).toString("utf8");
     data2= {
      url: req.url,
      method: req.method,
      requestID: req.id,
      env:'development',
      responseBody: Buffer.isBuffer(body) ? "file" : (body),
      statusCode: res.statusCode,
    }
    // winston logger - After API call
    logger.info("After call",data2 );

     // send logs to logstash
     logstashTCP(data2)

    oldEnd.apply(res, arguments);
  };
  next();
};
