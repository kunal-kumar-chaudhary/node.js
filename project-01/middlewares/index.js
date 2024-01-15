const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `${Date.now()}: ${req.method} ${req.url} new request recieved \n`,
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("log saved");
        }
      }
    );

    // if this line of code is missing, the request will not be passed on to the server for response\
    // this is because the request will be stuck in the middleware.
    next();
  };
}

module.exports = {
  logReqRes,
};
