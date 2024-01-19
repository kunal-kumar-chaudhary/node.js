// this is basically a database for storing user sessions
// const sessionIdToUserMap = new Map();

const jwt = require("jsonwebtoken");
const secret = "Kunal$1234@$abc";

function setUser(user){
    // return the complete user object as payload
    return jwt.sign(
        {
        _id: user._id,
        email: user.email,
    }, 
    secret);
}

function getUser(token){
    if (!token) return null;
    try{
        return jwt.verify(token, secret);
    }
    catch(err){
        return null;
    }
}

module.exports = {
    setUser, 
    getUser,
}