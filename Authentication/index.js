const express = require("express");
const bodyParser = require("body-parser");
const bCrypt = require("bcrypt");
const env = require("dotenv").config();
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
// passport middleware for handling authentication
const passport = require("passport");
const { Strategy } = require("passport-local");
// models which we have created to hold user's data regitering on our app
const User = require("./models/user");
const { connectToMongoDb } = require("./connect");

const app = express();
const port = 3000;
const saltRounds = 10;

// setting up the express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry time for cookie
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// database connection
connectToMongoDb("mongodb://localhost:27017/authDemo");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// app.post("/submit", (req, res) => {
//   if (req.isAuthenticated()) {
//     // update the secrets field of the user
//     User.updateOne(
//       { email: req.user.email },
//       { secrets: req.body.secret }
//     );
//     res.redirect("/secrets");
//   }
// });

// get request for rendering submit page
app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

// post request for submitting a request
app.post("/submit", async (req, res) => {
  const secret = req.body.secret;
  console.log("secret after submit: ", secret);
  // we will have access to user here because of passport containing email and passport but not the secrers as it
  // has not been serialized
  try {
    console.log("point 1");
    const result = await User.findOneAndUpdate({ email: req.user.email }, { secrets: secret });
    console.log("result: ", result);
    res.redirect("/secrets");
  } catch (err) {
    console.log("error in updating the secrets field of the user", err);
  }
});

// user can directly go to the secrets page if he is authenticated
app.get("/secrets", async (req, res) => {
  // we will have access to user here because of passport
  if (req.isAuthenticated()) {
    // we will not have secrets in the user object as it has not been serialized
    // getting all the secrets correspoding to the user and sending it to the secrets.ejs for rendering
    try {
      const result = await User.findOne({ email: req.user.email });
      const secret = result.secrets;
      console.log("secrets: ", secret);
      if (secret) {
        res.render("secrets.ejs", { secrets: secret });
      } else {
        res.render("secrets.ejs", { secrets: "No secrets yet" });
      }
    } catch (err) {
      console.log("error in getting the secrets of the user", err);
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("error in logout", err);
    } else {
      res.redirect("/");
    }
  });
});

// middlewares for google authentication
app.use(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// redirecting our user to the secrets page after successful authentication
app.use(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/secrets",
  })
);

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  // we will put our whole code in try and catch so as to prevent our app from crashing
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // hashing the password
      // hashing the password and then store it in the database

      bCrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("error in hashing the password ", err);
        } else {
          console.log("hashed password: ", hash);
          // it not only stores the user in the database but also returns the user
          const newUser = await User.create({ email, password: hash });
          // basically we are tryig to log in the user after signup through
          // proper authentication and preventing the user from directly going to the secrets page.
          // we are doing this to eliminate security issues
          console.log("new user: ", newUser);
          // use req.login to login the new user
          // this function will automatically trigger the "serializeUser" function
          // this function will automatically trigger the "deserializeUser" function
          req.login(newUser, (err) => {
            if (err) {
              console.log("error in login ", err);
            } else {
              res.redirect("/secrets");
            }
          });
        }
      });
    } else {
      res.send("User already exists");
    }
  } catch (err) {
    console.log("issue in registration ", err);
  }
});

// using local strategy for authentication, local strategy is used for authentication using username and password
// we will use passport.authenticate to authenticate the user
// this function will automatically trigger the "verify" function
// this function will automatically trigger the "serializeUser" function
// this function will automatically trigger the "deserializeUser" function
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

// one of the important thing to realize about how passport works is it gets triggered whenever we try to authenticate user.
// passport automatically through the use of "verify" function checks if the user is authenticated or not
// it automatically grabs the username and password from the form and then pass it to the verify function
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    const user = await User.findOne({ email: username });
    const storedHashedPassword = user.password;
    // if there is no user
    if (!user) {
      return cb("user not found");
    } else {
      // bCrypt.compare will return true if the hashes matches and false if it doesnot match
      bCrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          return cb(err);
        } else {
          if (result) {
            // this callback accepts two arguments first is error and second is user
            // in case result is true, we will pass null as error and user as user
            return cb(null, user);
          } else {
            // if the password is wrong
            // this "false" will be passed to the "isAuthenticated" function
            // and will further help us to figure out if the user is authenticated or not
            return cb(null, false);
          }
        }
      });
    }
  })
);

// google based startegy for authentication
/*
This middleware is set up for the route /auth/google. 
When a user accesses this route, Passport initiates the Google OAuth 2.0 
authentication process. The scope parameter is an array of strings 
specifying the types of access the application is requesting. 
In this case, it's requesting access to the user's profile information and 
email address.
*/

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        const result = await User.findOne({ email: profile.email });

        if (!result) {
          // we don't have this user in our database
          const newUser = await User.create({
            email: profile.email,
            password: profile.provider,
          });
          // using this callback, req.user will be populated with the newUser that we have created
          cb(null, newUser);
        } else {
          // already have this user in our database
          cb(null, result);
        }
      } catch (err) {
        cb(err);
      }
    }
  )
);

// saving the data of the user logged in to the local storage
// this function is responsible for storing the user data in the session
// this function is called when we call "passport.authenticate"
// this function accepts two arguments first is user and second is callback
// this callback accepts two arguments first is error and second is user

// due to the below serarlize and deseaerlize functions, we will have access to the user data in the session (anywhere in the whole code if the user is authenticated)
passport.serializeUser((user, cb) => {
  // first argument is error and second argument is user
  cb(null, user);
});

// this function is responsible for getting the data of the user from the session
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
