// express module
const express = require('express');
// express instance
const app= express();

const addRequestId = require("express-request-id")();
const winstonMiddleware = require('./WinstonMiddleware')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// X-Request-Id header
app.use(addRequestId)

// ignore /favicon.ico requests
app.use(function(req, res, next){
  if (req.url === '/favicon.ico') {
      res.writeHead(200, {'Content-Type': 'image/x-icon'} );
      res.end();
  } else {
      next();
  }
})
// winston logger middleware
app.use(winstonMiddleware)


app.get("/log",(req,res)=>{
  res.send("welcome to winston logger!")
})

app.listen(8088,()=>{
  `Server started`
})