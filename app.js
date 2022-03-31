const express = require("express");
const https = require("https");
const fs = require("fs");
var multer  = require('multer');

const options = {
	key: fs.readFileSync("server.key"), 
	cert: fs.readFileSync("server.crt"), 
};

const app = express(); 

app.set("view engine", "ejs"); 

const PORT = 5000;

app.get("/", (req, res) => {
	res.render("index"); 
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './Uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files', 12);
app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.end("Upload completed.");
    });
})

https.createServer(options, app).listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});