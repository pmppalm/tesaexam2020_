var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExamSchema = new Schema({
    number: {
        type: Number,
        unique: true,
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    score: {
        type: Number,
    }
});

mongoose.model('Exam', ExamSchema);