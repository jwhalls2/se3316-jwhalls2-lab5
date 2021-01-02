const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const router = express.Router();
require('dotenv/config');
require('./config/passportConfig');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

//Defining Models:
const User = require('./models/User.js');
const Schedule = require('./models/Schedule.js');

//Connecting to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to MongoDB!"));

var cors = require('cors');
app.use(cors());

// Saving the JSON file to an array to be used later.
let courseData = JSON.parse(fs.readFileSync('Lab3-timetable-data.json'));

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

//Limit is 20 Schedules per user.
const scheduleLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 20, // stops taking requests after 20
    message: "Exceeds schedule limit, please try again in 15 minutes!"
});

//Verifying the JWT token.
const checkToken = (req, res, next) => {
    let token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, secret,
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                else {
                    req.email = decoded.email;
                    next();
                }
            }
        )
    }
}

//get list of courses
router.get('/', (req, res) => {
    res.send(courseData);
});

// Gets list of courses by subject code
router.get('/:subject', [check('subject').isLength({ max: 8 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const subjectCode = req.params.subject;
    const course = courseData.filter((data) => String(data.subject) === subjectCode);
    if (course.length > 0) {
        res.send(course);
    } else {
        res.status(404).send(`Courses with subject code: ${subjectCode} were not found!`);
    }
});

// Gets list of courses by keywords
router.get('/keyword/:keyword', [check('keyword').isLength({ min: 4 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const key = req.params.keyword;
    const course = courseData.filter((data) => String(data.catalog_nbr).includes(key));
    const course2 = courseData.filter((data) => String(data.className).includes(key));

    if (course.length > 0 && course2.length < 1) {
        res.send(course);
    } else if (course.length < 1 && course2.length > 0) {
        res.send(course2);
    } else if (course.length > 0 && course2.length > 0) {

        var array = course.concat(course2).unique();
        res.send(array);
    } else {
        res.status(404).send(`Courses with keyword: ${key} were not found!`);
    }
});

Array.prototype.unique = function() {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};


// Get courses by catalog numbers
router.get('/course_catalog/:catalog_nbr', [check('catalog_nbr').isLength({ max: 5 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const courseCode = req.params.catalog_nbr;
    const course = courseData.filter((data) => String(data.catalog_nbr) === courseCode);
    if (course.length > 0) {
        res.send(course);
    } else {
        res.status(404).send(`Courses with course code: ${catalog_nbr} were not found!`);
    }
});

// Get details for a given course by subject, optional course component, and course code
router.get('/:subject/:catalog_nbr/:ssr_component?', [check('subject').isLength({ max: 8 }), check('catalog_nbr').isLength({ max: 5 }), check('ssr_component').isLength({ max: 3 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const subjectCode = req.params.subject;
    const courseCode = req.params.catalog_nbr;
    const courseComponent = req.params.ssr_component;

    const courseBySubject = courseData.filter((data) => String(data.subject) === subjectCode);
    if (courseBySubject.length < 1) {
        res.status(404).send(`Courses with subject code: ${subjectCode} were not found!`);
        return;
    }

    const courseByCode = courseBySubject.filter((data) => String(data.catalog_nbr) === courseCode);
    if (courseByCode.length < 1) {
        res.status(404).send(`Courses with subject code: ${subjectCode} and course code: ${courseCode} were not found!`);
        return;
    }

    if (!courseComponent) {
        res.send(courseByCode);
    } else {
        const courseByComponent = courseByCode.filter((data) => String(data.course_info[0].ssr_component) === courseComponent);

        if (courseByComponent.length < 1) {
            res.status(404).send(`Courses with subject code: ${subjectCode}, course code: ${courseCode}, and course component: ${courseComponent} were not found!`);
            return;
        } else {
            res.send(courseByComponent);
        }
    }

});

//GET a list of all schedules
app.get('/api/schedules', (req, res) => {
    Schedule.find({ public: true }, function(err, schedules) {
        res.send(schedules);
    }).sort({ updatedAt: -1 })
});

//GET a given schedule - we defined schedule names to be maximum 20 characters on the front end, so we keep this info for the backend, just in case anything manages
//to get past the front end validation.
app.get('/api/schedules/:schedule_name/:user', [check('schedule_name').isLength({ max: 20 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    scheduleName = req.params.schedule_name;
    username = req.params.user;
    Schedule.findOne({ name: scheduleName, user: username }, function(err, schedule) {
        if (!schedule) {
            res.status(404).json("Could not find schedule!");
        } else {
            res.send(schedule);
        }
    })
})

//DELETE a given schedule
app.delete('/api/schedules/:schedule_name/:user', [check('schedule_name').isLength({ max: 20 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    scheduleName = req.params.schedule_name;
    username = req.params.user;
    Schedule.findOne({ name: scheduleName, user: username }, function(err, schedule) {
        if (schedule) {
            Schedule.collection.deleteOne(schedule);
            res.status(200).json(`Schedule: ${scheduleName} deleted!`);
        } else {
            res.status(404).json(`Schedule: ${scheduleName} not found!`);
        }
    });
});

//DELETE all schedules
app.delete('/api/schedules', (req, res) => {
    Schedule.deleteMany({}, function(err, numRemoved) {
        if (err) {
            res.status(err);
        }
        res.json(console.log("Deleted all schedules!"));
    });
});


// POST a new schedule if that schedule name doesn't already exist.
app.post('/api/schedules', [check('name').isLength({ max: 20 })], checkToken, scheduleLimit, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const scheduleData = req.body;
    console.log(req.body.user);


    User.findOne({ username: req.body.user }, (err, user) => {
        if (err) res.status(404).json(err);
        if (user) {
            if (scheduleData.name) {
                let schedule = new Schedule(scheduleData);
                console.log(scheduleData.name + " Was sent to be added");
                schedule.save((err, schedule) => {
                    if (err) {
                        res.status(400).json(err);
                    } else res.status(200).send(schedule);
                });
            }
        } else res.status(404).json('User not found!')
    });
});


// Route that removes the document in the database with a matching name to the request sent, and then inserts the updated request body into the database.
app.put('/api/schedules', [check('name').isLength({ max: 20 })], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const overwriteSchedule = req.body;



    User.findOne({ username: req.body.user }, function(err, user) {
        if (err) {
            res.status(404).json(err);
        }
        if (user) {
            //Now check if schedule name exists
            Schedule.findOne({ name: overwriteSchedule.name, user: req.body.user }, function(err, schedule) {

                if (err) {
                    res.status(404).json(err);
                }
                if (schedule) {
                    Schedule.collection.deleteOne(schedule);
                    Schedule.collection.insertOne(overwriteSchedule);
                    res.status(200).json("Schedule updated!")
                } else {
                    res.status(404).json(`Schedule: ${overwriteSchedule.name} not found!`);
                }
            })
        } else {
            res.status(404).json("User not found!")
        }
    });
});

//Post for login
app.post('/api/login', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
})

//Post for registering
app.post('/api/register', (req, res, next) => {
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.admin = req.body.admin;
    user.activated = req.body.activated;
    user.verified = req.body.verified;

    // Make sure username/email are not duplicates

    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email address found.']);
            else
                return next(err);
        }

    });
})

//Route for authenticating user token
app.post('/api/authenticate')

// Installing router at the address /api/courseData
app.use('/api/courseData', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});