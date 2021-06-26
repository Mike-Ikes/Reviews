const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countersSchema = new Schema({
    _id: String,
    review_id: Number,
    photo_id: Number,
    characteristic_review_id: Number,
});

const countersModel = mongoose.model('counters', countersSchema);
module.exports = countersModel;