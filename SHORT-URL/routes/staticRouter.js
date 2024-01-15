const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const { render } = require("ejs");

// rendering home page
router.get("/", async (req, res)=>{
    console.log(req.user);
    if (!req.user){
        return res.redirect("/login");
    }
    //fetching all the records from inside the database regarding the shortid's
    const allUrls = await URL.find({});
    return res.render("home", {urls: allUrls}); 
}); 

router.get("/signup", (req, res)=>{
    return res.render("signup");
});

router.get("/login", (req, res)=>{
    return res.render("login");
});

module.exports = router; 