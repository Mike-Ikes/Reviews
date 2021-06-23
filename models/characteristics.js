const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characteristicsSchema = new Schema({
    product_id: Number,
    name: String,
    id: Number,
    value: [Number],
});

const characteristics = mongoose.model('characteristics', characteristicsSchema);
module.exports = characteristics;