const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const fs = require('fs');
const router = express.Router();
require('dotenv/config');
require('./config/passportConfig');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');
const stringSimilarity = require('string-similarity');

//Defining Models:
const User = require('./models/User.js');
const Schedule = require('./models/Schedule.js');
const Review = require('./models/Review.js');
const Policy = require("./models/Policy.js");

//Connecting to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to MongoDB!"));

var cors = require('cors');
const { update } = require('./models/User.js');
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
    //If the authorization header is in the headers, it includes the token number.
    if ('authorization' in req.headers)
        token = req.headers.authorization;
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
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
router.get('/open', (req, res) => {
    res.send(courseData);
});

// Gets list of courses by subject code
router.get('/open/:subject', [check('subject').isLength({ max: 8 })], (req, res) => {
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
router.get('/open/keyword/:keyword', [check('keyword').isLength({ min: 4 })], (req, res) => {
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
router.get('/open/course_catalog/:catalog_nbr', [check('catalog_nbr').isLength({ max: 5 })], (req, res) => {
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
router.get('/open/:subject/:catalog_nbr/:ssr_component?', [check('subject').isLength({ max: 8 }), check('catalog_nbr').isLength({ max: 5 }), check('ssr_component').isLength({ max: 3 })], (req, res) => {
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

//GET a list of all public schedules
app.get('/api/schedules/open', (req, res) => {
    Schedule.find({ public: true }, function(err, schedules) {
        res.send(schedules);
    }).sort({ updatedAt: -1 })
});

//GET a given schedule - we defined schedule names to be maximum 20 characters on the front end, so we keep this info for the backend, just in case anything manages
//to get past the front end validation.
app.get('/api/schedules/secure/:schedule_name/:user', [check('schedule_name').isLength({ max: 20 })], checkToken, (req, res) => {
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
            console.log(schedule);
            const array = [schedule];
            res.send(array);
        }
    })
})

//DELETE a given schedule
app.delete('/api/schedules/secure/:schedule_name/:user', [check('schedule_name').isLength({ max: 20 })], checkToken, (req, res) => {
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

//DELETE all schedules for one user
app.delete('/api/schedules/secure/:user', checkToken, (req, res) => {
    Schedule.deleteMany({ user: req.params.user }, function(err, schedules) {
        if (err) {
            res.status(err);
        }
        res.json(console.log("Deleted all schedules!"));
    });
});


// POST a new schedule if that schedule name doesn't already exist.
app.post('/api/schedules/secure', [check('name').isLength({ max: 20 })], checkToken, scheduleLimit, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }


    const scheduleData = req.body;

    User.findOne({ username: req.body.user }, (err, user) => {
        if (err) res.status(404).json(err);
        if (user) {
            if (scheduleData.name) {
                let schedule = new Schedule(scheduleData);
                Schedule.findOne({ user: scheduleData.user, name: scheduleData.name }, (error, existingSchedule) => {
                    if (error) res.status(404).json(error);
                    if (existingSchedule) {
                        res.status(400).json("This schedule name already exists!");
                    } else {
                        console.log(scheduleData.name + " Was sent to be added");
                        console.log(schedule);
                        schedule.save((err, schedule) => {
                            if (err) {
                                res.status(400).json(err);
                            } else res.status(200).send(schedule);
                        });
                    }
                })

            }
        } else res.status(404).json('User not found!')
    });
});


// Route that removes the document in the database with a matching name to the request sent, and then inserts the updated request body into the database.
app.put('/api/schedules/secure', [check('name').isLength({ max: 20 })], checkToken, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const overwriteSchedule = req.body;

    for (var i = 0; i < overwriteSchedule.subject.length; i++) {

        for (var j = 0; j < courseData.length; j++) {

            if (courseData[j].subject == overwriteSchedule.subject[i] &&
                courseData[j].catalog_nbr == overwriteSchedule.course_code[i]) {
                break;
            } else if (j == courseData.length - 1) {
                res.status(404).send({ message: "One or more of these courses do not exist! Check your course pairs and try again!" })
                return;
            }

        }
        console.log(`${overwriteSchedule.subject[i]} ${overwriteSchedule.course_code[i]} is safe to be added!`);
    }

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
        console.log(user);
        if (user.activated == false) {
            res.status(400).send("Your account has been deactivated. Please contact an administrator to have them fix this before you can log back in.");
        }
        // error from passport middleware
        else if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt(), "user": user });
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
    user.admin = false;
    user.activated = true;
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

//Returns the given user's information to be displayed.
app.get("/secure/user/:username", (req, res) => {

    User.findOne({ username: req.params.username }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(400).send(`User ${req.params.username} was not found!`);
        } else {
            res.send(user);
        }
    });
});

//Gets all of the non-hidden reviews:
app.get('/api/open/allReviews', (req, res) => {
    Review.find({ hidden: false, infringing: false }, 'title courseId rating comment createdBy createdAt', function(err, review) {
        if (err) {
            return console.error(err);
        } else {
            console.log(review);
            res.send(review);
        }
    });
});

//Allows a user to post a review
app.post("/api/secure/review", checkToken, (req, res, next) => {

    let newReview = new Review({
        title: req.body.title,
        courseId: req.body.courseId,
        rating: req.body.rating,
        comment: req.body.comment,
        hidden: req.body.hidden,
        createdBy: req.body.createdBy,
        infringing: false
    });

    Review.findOne({ title: req.body.title }, function(err, review) {
        if (review) {
            res.status(400).send("Review with this title already exists!");
            return;
        } else if (!req.body.title) {
            res.status(400).send("You must include a title for your review");
        } else if (req.body.title.length > 30) {
            res.status(400).send("This title is too long!");
        } else if (!req.body.courseId) {
            res.status(400).send("Which course are you trying to review?");
        } else if (!req.body.rating) {
            res.status(400).send("What is your rating for this course?");
        } else if (!req.body.createdBy) {
            res.status(400).send("Must be signed in to create a review!");
        } else if (!req.body.comment) {
            res.status(400).send("You must provide a comment for your review!");
        } else {
            newReview.save(function(err) {
                if (err) {
                    console.error(err.message);
                    res.send(err.message);
                } else {
                    res.send(JSON.stringify(newReview));
                }
            });
        }
    })
});

//Allows admins to get all reviews (hidden or not).
app.get("/api/admin/reviews/:username", (req, res) => {
    User.findOne({ username: req.params.username }, function(err, user) {
        if (user) {
            if (user.admin == true) {
                Review.find({}, 'title comment rating courseId hidden createdBy createdAt', function(err, review) {
                    if (err) {
                        return console.error(err);
                    } else if (req.body.admin == false) {
                        res.send({ message: "You are not an administrator!" });
                    } else {
                        res.send(JSON.stringify(review));
                    }
                });
            } else {
                res.status(400).send("You are not an administrator!");
            }

        } else {
            res.status(400).send("Please sign in to access this!");
        }
    })

});

//Allows admins to mark reviews as hidden
app.put('/api/admin/reviews', checkToken, function(req, res, next) {

    console.log(req.body.user);
    User.findOne({ username: req.body.user }, function(err, user) {
        if (user) {
            if (user.admin == true) {
                Review.findOneAndUpdate({ title: req.body.title }, req.body).then(function() {
                    Review.findOne({ title: req.body.title }).then(function(review) {
                        res.send(review);
                    });
                });

            } else {
                res.status(400).send("You are not an administrator!");
            }
        } else {
            res.status(400).send("Please sign in to access this!");
        }
    })

});

//Allows admin to update a user's account (admin/active/deactive)
app.put("/api/admin/user", checkToken, function(req, res, next) {

    console.log(req.body);
    User.findOne({ username: req.body.adminName }, function(err, user) {

        if (!user) {
            res.status(404).send({ message: `No user by name ${req.body.adminName}!` })
        }
        if (!user.admin) {
            res.send({ message: "You are not an administrator!" });
        }
    })
    if (req.body.admin == null) {
        res.status(400).send("Invalid! Choose true or false to let user be admin or not.");
    }

    if (req.body.activated == null) {
        res.status(400).send("Invalid! Choose true or false to deactivate user account!");
    } else {
        User.findOneAndUpdate({ username: req.body.username }, req.body).then(function() {
            User.findOne({ username: req.body.username }).then(function(user, err) {
                if (err) {
                    res.send(err);
                }
                res.send(JSON.stringify(user));
            });
        });
    }
});

//route for users to change their password
app.put('/api/secure/changePassword/:username', checkToken, (req, res) => {
    let password = req.body.password;
    console.log(password);
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    req.body.password = hash;

    password = hash;
    if (password == "") {
        res.status(400).send("No password!");
    } else {
        User.findOneAndUpdate({ username: req.params.username }, req.body).then(function() {
            User.findOne({ username: req.params.username }).then(function(foundUser) {
                console.log(password);
                res.send(foundUser);
            });
        });
    }

});
//POLICY STUFF
//Get policy route
app.get('/api/policy', (req, res) => {
    Policy.find(function(err, policies) {
        if (err) {
            res.send(err);
        }
        res.send(policies);
    });
});

//Post policy route
app.post('/api/policy', (req, res) => {
    policy = new Policy();
    policy.firstPolicy = req.body.firstPolicy;
    policy.secondPolicy = req.body.secondPolicy;
    policy.thirdPolicy = req.body.thirdPolicy;
    policy.save(function(err, policy) {
        if (err) {
            res.send(err)
        }
        res.json({ message: "Policy Created!", policy: policy })
    })
})

//Put policy route
app.put('/api/policy/:policy_id', (req, res) => {
    let policy1 = req.body.firstPolicy;
    let policy2 = req.body.secondPolicy;
    let policy3 = req.body.thirdPolicy;
    Policy.findById(req.params.policy_id, function(err, policy) {
        if (err)
            res.send(err);

        policy.firstPolicy = policy1;
        policy.secondPolicy = policy2;
        policy.thirdPolicy = policy3;

        policy.save(function(err) {
            if (err)
                res.send(err)
            res.json({ message: 'Policies Saved!' });
        });
    });
})

// Installing router at the address /api/courseData
app.use('/api/courseData', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});