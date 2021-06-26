const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    id: {type: Number, unique: true},
    product_id: Number,
    rating: Number,
    date: Number,
    summary: String,
    body: String,
    recommend: Boolean,
    reported: Boolean,
    reviewer_name: String,
    reviewer_email: String,
    response: String,
    helpfulness: Number,
});

const reviewsModel = mongoose.model('reviews', reviewSchema);
module.exports = reviewsModel;