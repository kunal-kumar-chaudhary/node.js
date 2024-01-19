const {v4 : uuidv4} = require("uuid"); 
const { setUser } = require("../service/auth");
// requiring the model for user details addition
const User = require("../models/user");

async function handleUserSignup(req, res){
    const {name, email, password} = req.body;
    // creating a new user in the databases
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");
}

async function handleUserLogin(req, res){
    const {email, password} = req.body;
    console.log("inside handleuserlogin", email, password);
    const user = await User.findOne({email, password});
    console.log("user", user);
    // checking if there is no user with the given email and password
    if(!user){
        return res.render("login",  {error: "Invalid user name or password"});

    }
    // if password and email matches then we will create a session for the user
    
    const token = setUser(user);
    res.cookie("uid", token);
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}