// we need to make HTTP server (api server)

const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');

const app = express(); // this app is basically a handler function

app.get("/home", (req, res)=>{
    return res.send(`<h1>we are on home page, hey ${req.query.name}</h1>`);
})

app.get("/about", (req, res)=>{
    return res.send("<h1>we are on about page</h1>");
})

const myHandler = (req, res)=>{
    const myUrl = url.parse(req.url, true);
    const log = `${Date.now()}: ${myUrl.pathname} and ${myUrl.query.name} new request recieved \n`;
    console.log(log);
    console.log(myUrl);
    // we will end the request by sending a response
    fs.appendFile("log.txt", log, (err, data)=>{
        switch(myUrl.pathname){
            case '/':
                res.end("hello world");
                break;
            case '/about':
                const username = myUrl.query.name;
                res.end(`hi, ${username}`);
                break;
            case '/contact':
                res.end("this is contact page");
                break;
            case '/signup':
                if (req.method === "GET"){
                    res.end("this is a signup page");
                }
                else if (req.method === "POST"){
                    // if this is a post request, that means user is trying to sign up
                    // i.e, trying to send data over server
                    // querying the database -->> inserting the data
                    res.end("signup success")
                }
                break;
            default:
                res.end("404 page not found");
                break;
        }
    })
}

// takes a callback (handler function)  which can process the incoming requestss
// const myServer = http.createServer(myHandler);
// earlier we used to pass our own handler function, but now express has 
// created handler function for us, we just need to pass it to the server


app.listen(8000, ()=>{
    console.log("server started and is listening on port 8000");
});

// even below lines of code is not required, that can also be handled by express
// const myServer = http.createServer(app); 

// myServer.listen(8000, ()=>{
//     console.log("server started and is listening on port 8000");
// })
 