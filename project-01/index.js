const express = require("express");

const app = express();
const PORT = 8000;
const {logReqRes} = require("./middlewares/index.js")
const userRouter = require("./routes/user.js");
const { connectMongoDb } = require("./connection");

// connecting to moongose
connectMongoDb("mongodb://localhost:27017/first_database")
.then(()=>{console.log("connected to mongoDB")});


// middleware - plugin
// this plugin picks up the data, and create a  javascript object with it and
// appends it inside the body of the request
app.use(express.urlencoded({ extended: false }));

// // let's make a middleware for designing our own logger -> information regarding the request methods and other several factors
// app.use((req, res, next) => {
//   console.log("hello form middleware 1");
//   next(); // this will pass the request to the next middleware
//   // in case of no next(), the request will be passed on to the route handler which will run some functions and return the response.
// });

// app.use((req, res, next) => {
//   console.log("hello form middleware 2");
//   next();
// });

app.use(logReqRes("log.txt"));

// router
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`SERVER STARTED AT PORT ${PORT}`);
});
