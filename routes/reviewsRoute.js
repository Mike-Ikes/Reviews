var express = require('express');
var router = express.Router();
const { DateTime } = require('luxon');

const Review = require('../models/reviews')
const Photo = require('../models/reviews_photos')
const Characteristic = require('../models/characteristics')
const CharacteristicsReview = require('../models/characteristics_reviews')
const Counter = require('../models/counters')

// endpoint route for reviews GET and POST request

router.get('/', async function(req, res) {

  let { page = 1, count = 5, sort, product_id = 1 } = req.query;
  if (sort === 'helpful') {
    sort = {'helpfulness': -1};
  }
  if (sort === 'newest') {
    sort = {'date': -1}
  }
  if (sort === 'relevant') {
    sort = {'helpfulness': -1, 'date': -1}
  }
  let reviews = await Review.find({product_id: product_id, reported: false}, {_id: 0, product_id: 0, reviewer_email: 0, reported: 0, __v: 0}).sort(sort).skip(count * (page - 1)).limit(parseInt(count)).lean()
  for await (let review of reviews) {
    review.date = DateTime.fromMillis(review.date).toISO();
    let num = review.recommend ? 1 : 0;
    review.recommend = num;
    review.review_id = review.id
    delete review.id;
    review['photos'] = await Photo.find({review_id: review.review_id}, {_id: 0, __v: 0}).lean();
  }
  res.send({results: reviews});
});

router.post('/:id', async function(req, res) {
  let {id} = req.params
  let {rating, summary, body, recommend, name, email, photos, characteristics} = req.body

  const incrementor = await Counter.findOneAndUpdate({_id: 'id' }, {$inc:{review_id:1}}, {new: true});
  const reviewCount = incrementor.review_id;
  const date = new Date()
  await Review.create({
    id: reviewCount,
    product_id: id,
    rating: rating,
    date: date.getTime(),
    summary: summary,
    body: body,
    recommend: recommend,
    reported: false,
    reviewer_name: name,
    reviewer_email: email,
    response: null,
    helpfulness: 0,
  })

  for await (let photo of photos) {
    const incrementor = await Counter.findOneAndUpdate({_id: 'id' }, {$inc:{photo_id:1}}, {new: true});
    const photoCount = incrementor.photo_id;
    await Photo.create({
      id: photoCount,
      review_id: reviewCount,
      url: photo
    })
  }

  for await (let key of Object.keys(characteristics)) {
    const incrementors = await Counter.findOneAndUpdate({_id: 'id' }, {$inc:{characteristic_review_id:1}}, {new: true});
    const characteristicReviewCount = incrementors.characteristic_review_id;
    await CharacteristicsReview.create({
      id: characteristicReviewCount,
      characteristic_id: key,
      review_id: reviewCount,
      value: characteristics[key],
    })
  }
  res.sendStatus(201)
})

// endpoint route for Meta Data

router.get('/:id/meta', async function(req, res) {
  const { id } = req.params;
  let characteristics = {};
  let ratings = {};
  let recommended = {};

  let meta = await Characteristic.find({product_id: id}, {__v: 0}).sort({'id': -1}).lean()
  for await (let attr of meta) {
    let total = 0;
    let individual = await CharacteristicsReview.find({characteristic_id: attr.id}, {__v: 0}).lean()
    for (let same of individual) {
      total += same.value
    }
    characteristics[attr.name] = {
      'id': attr.id,
      'value': (total/individual.length).toFixed(4)
    }
  }
  let reviews = await Review.find({product_id: id, reported: false})
  for (let review of reviews) {
    const num = review.recommend ? 1 : 0;
    !ratings[review.rating] ? ratings[review.rating] = 1 : ratings[review.rating] +=1;
    !recommended[num] ? recommended[num] = 1 : recommended[num] +=1;
  }
  res.send({product_id: id, ratings, recommended, characteristics});
});

// endpoint route for reporting review

router.put('/:review_id/report', async function(req, res) {
  const { review_id } = req.params;
  await Review.updateOne({id: review_id}, {$set: {reported: true}})
  res.sendStatus(204);
});

// endpoint route for helpful

router.put('/:review_id/helpful', async function(req, res) {
  const { review_id } = req.params;
  await Review.updateOne({id: review_id}, {$inc: {helpfulness: 1}})
  res.sendStatus(204);
});

module.exports = router;
