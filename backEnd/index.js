const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const router = express.Router();
require('dotenv/config');
//require('./config/passportConfig');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

//Connecting to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to MongoDB!"));

var cors = require('cors');
app.use(cors());

// Saving the JSON file to an array to be used later.
let courseData = JSON.parse(fs.readFileSync('./Lab3-timetable-data.json'));

//Setup serving front-end code
app.use('/', express.static('static'));
app.use(passport.initialize());

// Setup middelware for logging
app.use((req, res, next) => { // for all routes
    console.log(`${req.method} request for ${req.url}`);
    next() // keep going
});

// This is a built in express function for parsing as a json.
// Essentially identical to bodyParser.
app.use(express.json());

//Route for authenticating user token
app.post('/api/authenticate')

// Installing router at the address /api/courseData
app.use('/api/courseData', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});