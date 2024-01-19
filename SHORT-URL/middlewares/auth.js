const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  // get the session id of user from cookie
  const userUid = req.cookies?.uid;
  if (!userUid) {
    return res.redirect("/login");
  }
  const user = getUser(userUid);
  if (!user) {
    return res.redirect("/login");
  }
  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  // if the generated token is present in cookie with key uid, then we will verify the user ahead
  const userUid = req.cookies?.uid;
  // verification of the user whether he is authorized or not
  const user = getUser(userUid);
  // in the request object we will add a new property user and assign it the value of user
  req.user = user;
  // next is a function which will call the next middleware, in this case it will call the route
  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};
