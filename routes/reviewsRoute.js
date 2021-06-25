var express = require('express');
var router = express.Router();
const { DateTime } = require('luxon');

const Review = require('../models/reviews')
const Photo = require('../models/reviews_photos')
const Characteristic = require('../models/characteristics')
const CharacteristicsReview = require('../models/characteristics_reviews')

const mongoose = require('mongoose')

// endpoint route for reviews GET and POST request

router.get('/', async function(req, res, next) {
  let {page = 1, count = 5, sort, product_id} = req.query;
  if (sort === 'helpful') {
    sort = {'helpfulness': -1};
  }
  if (sort === 'newest') {
    sort = {'date': -1}
  }
  let reviews = await Review.find({product_id: product_id, reported: false}, {_id: 0, reviewer_email: 0, reported: 0}).sort(sort).skip(count * (page - 1)).limit(parseInt(count)).lean()
  for await (let review of reviews) {
    review.date = DateTime.fromMillis(review.date).toISO();
    review['photos'] = await Photo.find({review_id: review.id}, {_id: 0}).lean()
  }
  return res.json({
    product: product_id,
    page: page,
    count: count,
    results: reviews
  })
  // res.send('success on "/reviews" GET', );
});

router.post('/', async function(req, res, next) {
  //
  res.send('success on "/reviews" POST')
})

// endpoint route for Meta Data

router.get('/meta', async function(req, res, next) {
  const id = req.query.product_id;
  let characteristics = {};
  let ratings = {};
  let recommended = {};

  let meta = await Characteristic.find({product_id: id}).sort({'id': -1}).lean()
  for await (let attr of meta) {
    let average = 0;
    let count = 0;
    let individual = await CharacteristicsReview.find({characteristic_id: attr.id}).lean()
    for (let same of individual) {
      average += same.value
      count++
    }
    characteristics[attr.name] = {
      'id': attr.id,
      'value': (average/count).toFixed(4)
    }
  }
  let reviews = await Review.find({product_id: id, reported: false})
  for (let review of reviews) {
    const num = review.recommend ? 1 : 0;
    !ratings[review.rating] ? ratings[review.rating] = 1 : ratings[review.rating] +=1;
    !recommended[num] ? recommended[num] = 1 : recommended[num] +=1;
  }
  return res.json({product_id: id, ratings, recommended, characteristics})
  // res.send('Success on "/reviews/meta" GET');
});

// endpoint route for reporting review

router.put('/:review_id/report', async function(req, res, next) {
  res.send('Success on "/reviews/:review_id/report PUT');
});

// endpoint route for helpful

router.put('/:review_id/helpful', async function(req, res, next) {
  res.send('Success on "/reviews/:review_id/helpful PUT');
});

module.exports = router;
