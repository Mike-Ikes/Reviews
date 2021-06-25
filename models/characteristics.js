const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characteristicsSchema = new Schema({
    id: Number,
    product_id: Number,
    name: String,
});

const characteristicsModel = mongoose.model('characteristics', characteristicsSchema);
module.exports = characteristicsModel;