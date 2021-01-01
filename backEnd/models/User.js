const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    },
    activated: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

//Methods:

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


userSchema.pre('save', async function(next) {
    if (this.password != null && this.password != '') {
        try {
            const hashedPass;
            next();
        } catch (error) {
            console.log(error);
        }
    }
})

userSchema.methods.generateJwt = function() {
    return jwt.sign({ _id: this._id },
        process.env.JWT_SECRET, { expiresIn: '25m' })
}

const User = mongoose.model('User', userSchema);
module.exports = User;