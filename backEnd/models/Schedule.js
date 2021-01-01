const mongoose = require('mongoose');
const SchedSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: Array,
        required: true
    },
    course_code: {
        type: Array,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    }
});

const Schedule = mongoose.model('Schedules', SchedSchema);
module.exports = Schedule;