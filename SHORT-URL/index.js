const express = require("express");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const {restrictToLoggedInUserOnly, checkAuth} = require("./middlewares/auth");
// this module comes as built in with NodeJS
const path = require("path");
const app = express(); 
const PORT = 8001;
const URL = require("./models/url");

// database connection
const { connectToMongoDB } = require("./connect");
connectToMongoDB("mongodb://localhost:27017/url-shortener")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.json());
// middleware to parse the form data
app.use(express.urlencoded({ extended: false }));
// if we are using cookies, we need a middleware to parse the cookies
app.use(cookieParser());

// routing
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute)
app.use("/", checkAuth, staticRoute);

app.use("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timeStamp: Date.now() },
      },
    }
  );
  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectedURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
