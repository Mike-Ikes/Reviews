const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Photo = require('./photosModel')

const reviewSchema = new Schema({
    product_id: Number,
    review_id: Number,
    rating: Number,
    summary: String,
    recommend: Boolean,
    response: String,
    body: String,
    date: Date,
    reviewer_name: String,
    helpfulness: Number,
    photos: [Object],
});

const review = mongoose.model('review', reviewSchema);
module.exports = review;