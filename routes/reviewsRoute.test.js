/* eslint-disable no-undef */
const { app } = require('../app.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const request = supertest(app)
const Review = require('../models/reviews')
const Counter = require('../models/counters')

afterAll((done) => {
  mongoose.connection.close()
  done()
});

describe('testing if body always returns an array', () => {

  it('Should return an array for HTTP request on product with reviews', async () => {
    const { body } = await request.get('/reviews');
    expect(Array.isArray(body.results)).toEqual(true);
  })

  it('Should return an array for HTTP request on product without reviews', async () => {
    const { body } = await request.get('/reviews?product_id=3');
    expect(Array.isArray(body.results)).toEqual(true);
  })

})

describe('testing response body is in correct format for GET "/reviews"', () => {

  it('should be an object with matching property primitives', async () => {
    const { body } = await request.get('/reviews');
    expect(body.results[0]).toEqual(expect.objectContaining({
        body: expect.any(String),
        date: expect.any(String),
        helpfulness: expect.any(Number),
        photos: expect.any(Array),
        rating: expect.any(Number),
        recommend: expect.any(Number),
        response: expect.any(String),
        review_id: expect.any(Number),
        reviewer_name: expect.any(String),
        summary: expect.any(String),
    }));
  })

})

describe('testing response body is in correct format for Get "/reviews/:id/meta"', () => {

  it('should be an object with 4 properties', async () => {
    const { body } = await request.get('/reviews/1/meta');
    expect(body).toEqual(expect.objectContaining({
      product_id: expect.any(String),
      ratings: expect.any(Object),
      recommended: expect.any(Object),
      characteristics: expect.any(Object),
    }))
  })

  it('should have values in correct format', async () => {
    const { body } = await request.get('/reviews/1/meta');
    for (let key in body.ratings) {
      expect(body.ratings[key]).toEqual(expect.any(Number))
    }
    expect(body).toMatchObject({
      product_id: expect.any(String),
      recommended: {
        0: expect.any(Number),
        1: expect.any(Number),
      },
    });
    for (let key in body.characteristics) {
      expect(body.characteristics[key]).toMatchObject({
        id: expect.any(Number),
        value: expect.any(String),
      })
    }
  })
})

describe('API endpoint for POST "/reviews" creates new review for product', () => {
  let reviewCounter;

  it('Database should NOT have review with review_id of + 1 over counter', async () => {
    const counter = await Counter.find();
    const reviewCount = counter[0].review_id;
    reviewCounter = reviewCount
    const body = await Review.find({id: reviewCount + 1})
    expect(body).toHaveLength(0)
  });

  it('POST request should send back status code 201 when creating new review', async () => {
    const newReview = {
      product_id: 1,
      rating: 5,
      date: new Date().getTime(),
      summary: 'This is for a Jest/Supertest function',
      body: 'Just want to insert a random review with a really high number',
      recommend: true,
      name: 'Hello World',
      email: 'Hello_World@mail.com',
      helpfulness: 0,
      photos: [],
      characteristics: {},
    };
    const postRequest = await request.post('/reviews/1')
      .send(newReview)
      .expect(201);
  });

  it(`Database SHOULD have new create review with id of one higher than it originally had`, async () => {
    const body = await Review.find({id: reviewCounter + 1}, {_id: 0, __v: 0})
    expect(body[0]).toMatchObject({
      id: expect.any(Number),
      product_id: expect.any(Number),
      rating: expect.any(Number),
      date: expect.any(Number),
      summary: expect.any(String),
      body: expect.any(String),
      recommend: expect.any(Boolean),
      reported: expect.any(Boolean),
      reviewer_name: expect.any(String),
      reviewer_email: expect.any(String),
      helpfulness: expect.any(Number),
    });
  });

  it(`Database should NOT have previously created review`, async () => {
    const deleteReview = await Review.findOneAndDelete({id: reviewCounter + 1});
    const reset = await Counter.findOneAndUpdate({_id: 'id'}, {$inc: {review_id: -1}}, {new: true});
    const deletedReview = await Review.find({id: reviewCounter + 1});
    expect(reset.review_id).toEqual(reviewCounter);
    expect(deletedReview).toHaveLength(0);
  });

})
