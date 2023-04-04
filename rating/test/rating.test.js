const app = require('../src/server');
const supertest = require('supertest');
const mongoose = require('mongoose');
const { RatingModel } = require('../src/database');

beforeEach((done) => {
  mongoose.connect(
    'mongodb://localhost:27017',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done(),
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

const rating = {
  placeId: '123',
  authorId: '456',
  value: 5,
  comment: "C'est bieng",
};

describe('The rating service', () => {
  describe('Creating a rating', () => {
    it('should return a success', async () => {
      const response = await supertest(app)
        .post('/')
        .send({ user: { id: '456' }, ...rating });
      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual('Rating successfully created');
    });
    it('should return a 400 error if one or many fields are missing', async () => {
      const response = await supertest(app).post('/').send({ placeId: '123' });
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('Missing data');
    });
    it('should return a 409 error if the rating already exists', async () => {
      await RatingModel.create(rating);
      const response = await supertest(app)
        .post('/')
        .send({ user: { id: '456' }, ...rating });
      expect(response.statusCode).toEqual(409);
      expect(response.body.message).toEqual('Rating already exists');
    });
  });
  describe('Getting ratings by place', () => {
    it('should return an array of ratings', async () => {
      await RatingModel.create(rating);
      const response = await supertest(app).get(`?placeId=${rating.placeId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('ratings');
      expect(response.body.ratings[0]).toMatchObject(rating);
    });
  });
  describe('Getting ratings by author', () => {
    it('should return an array of ratings', async () => {
      await RatingModel.create(rating);
      const response = await supertest(app).get(`?authorId=${rating.authorId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('ratings');
      expect(response.body.ratings[0]).toMatchObject(rating);
    });
  });
});
