var express = require('express');
var router = express.Router();
const Review = require('../models/reviewModel')
const mongoose = require('mongoose')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let r = await Review.insertMany({
    "product_id": 1003,
    "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "michael": 'Michael',
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
        "id": 1,
        "url": "urlplaceholder/review_5_photo_number_1.jpg"
      },
      {
        "id": 2,
        "url": "urlplaceholder/review_5_photo_number_2.jpg"
      },],
  })
  res.send('respond with a resource');
});

module.exports = router;