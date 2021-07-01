var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

mongoose.connect('mongodb://mongodb:27017/review_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => {})
.catch((err) => {
  console.log("Mongoose error: " + err)
})

var reviewRouter = require('./routes/reviewsRoute')

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/reviews', reviewRouter);

module.exports = {
  app: app,
}
