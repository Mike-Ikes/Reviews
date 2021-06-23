const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Characteristics = require('./characteristics')

const metaDataSchema = new Schema({
    ratings: {
      1: Number,
      2: Number,
      3: Number,
      4: Number,
      5: Number,
    },
    recommend: {
      0: Number,
      1: Number,
    }
    characteristics: [Characteristics]
});

const metaData = mongoose.model('metaData', metaDataSchema);
module.exports = metaData;