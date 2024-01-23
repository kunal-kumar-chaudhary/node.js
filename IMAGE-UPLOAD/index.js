const path = require("path");
const express = require("express");
const multer = require("multer");

// note - multer helps in files upload

const app = express();
const PORT = 8000;

const storage = multer.diskStorage({
    // folder in which we have to store the file
    destination: (req, res, cb)=>{
        return cb(null, "./uploads");
    },
    // naming the file in the local storage for the server
    filename: (req, file, cb)=>{ 
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({storage: storage}); 

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: true})); // helps in parsing the form data


app.get("/", (req, res)=>{
    return res.render("homepage");
});

// upload.single("profileImage") - profileImage is the name of the input field in the form
// upload will use the configuration of multer defined above
app.post("/upload", upload.single("profileImage"), (req, res)=>{  
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
});

// listening on port 8000
app.listen(PORT, ()=>{
    console.log("Listening on port: ", PORT);
});