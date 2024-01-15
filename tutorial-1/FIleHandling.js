const fs = require('fs');
const os = require('os');

// synchronous call
fs.writeFileSync("./test.txt", "hey there");

// reading file
const result = fs.readFileSync("./contact.txt", "utf-8");
console.log(result); 

// reading file asynchronously
// this requires a callback function and doesnot return the results immediately
fs.readFile("./contact.txt", "utf-8", (err, data) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(data);
    }
}
);

// appending to a file
fs.appendFileSync("./test.txt", new Date().getDate().toString());

// copying a file
// it will overwrite the file if it already exists
fs.copyFileSync("./contact.txt", "./test.txt");

// checking the stats of a file
console.log(fs.statSync("./test.txt"));

// we can even create folders recursively
fs.mkdirSync("./testFolder/testFolder2", {recursive: true});

// checking the number of threads in the cpu
// we can have maximum thread size equal to number of cores in the cpu
console.log(os.cpus().length);

// note - asynchronous calls are non blocking and it's always better to use them