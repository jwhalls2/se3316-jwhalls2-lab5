const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
require('../models/User');

const User = mongoose.model('User');

passport.use(
    new localStrategy({
        usernameField: 'email'
    }, (username, password, done) => {
        User.findOne({ email: username },
            (err, user) => {
                if (err) {
                    return done(err);
                }
                //If that user is not registered
                else if (!user) {
                    return done(null, false, { message: `Email isn't registered!` });
                }
                //If that password is incorrect
                else if (!user.verifyPassword(password)) {
                    return done(null, false, { message: `Incorrect password!` });
                }
                //If authentication is successful
                else {
                    return done(null, user);
                }

            })
    })
)