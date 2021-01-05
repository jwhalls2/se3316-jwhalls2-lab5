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
    },
    user: {
        type: String
    },
    created_at: { type: Date },

    updated_at: { type: Date },
});

SchedSchema.set('timestamps', true);
const Schedule = mongoose.model('Schedules', SchedSchema);
module.exports = Schedule;