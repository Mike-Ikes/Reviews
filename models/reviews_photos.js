const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewsPhotoSchema = new Schema({
    id: Number,
    review_id: Number,
    url: String,
});

const reviewsPhotoModel = mongoose.model('reviews_photo', reviewsPhotoSchema);
module.exports = reviewsPhotoModel;