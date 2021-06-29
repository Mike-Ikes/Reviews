const { app } = require('../app.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const request = supertest(app)

afterAll((done) => {
  mongoose.connection.close()
  done()
});

it('Should return an array for Model.find() for Reviews of a product with or w/o reviews', async () => {
  const { body } = await request.get('/reviews');
  expect(Array.isArray(body.results)).toEqual(true);
})


