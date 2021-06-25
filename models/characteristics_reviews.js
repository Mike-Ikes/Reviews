const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characteristicsReviewsSchema = new Schema({
    id: Number,
    characteristic_id: Number,
    review_id: Number,
    value: Number,
});

const characteristicsReviewModel = mongoose.model('characteristics_reviews', characteristicsReviewsSchema);
module.exports = characteristicsReviewModel;