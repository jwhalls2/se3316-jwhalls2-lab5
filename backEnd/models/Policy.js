const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    firstPolicy: String,
    secondPolicy: String,
    thirdPolicy: String
})

const Policy = mongoose.model('policies', PolicySchema);

module.exports = Policy;