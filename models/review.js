const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: user
    }
});

module.exports = mongoose.model("Review", reviewSchema);