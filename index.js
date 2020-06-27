// express module
const express = require("express");
// express instance
const app = express();
require('dotenv').config();
const addRequestId = require("express-request-id")();
const { logger, Middleware } = require("./WinstonMiddleware");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// X-Request-Id header
app.use(addRequestId);

// ignore /favicon.ico requests
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end();
  } else {
    next();
  }
});
// winston logger middleware
app.use(Middleware);

app.get("/log", (req, res) => {
  console.log("this is not logged to file or elk");
  // error log
  logger.error({msg:"This is a error level log"});
  // warn log
  logger.warn("This is a warn level log");
  //info log
  logger.info("This is a info level log");
  res.send("welcome to winston logger!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
