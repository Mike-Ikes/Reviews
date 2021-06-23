const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    url: String,
});
const photo = mongoose.model('photo', photoSchema);
module.exports = photo;