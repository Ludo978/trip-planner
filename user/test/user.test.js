const app = require('../src/server');
const supertest = require('supertest');
const mongoose = require('mongoose');
const { UserModel } = require('../src/database');

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

const user = {
  username: 'test',
  email: 'test@test.com',
  password: 'test',
};

describe('The user service', () => {
  describe('Creating a user', () => {
    it('should return a success', async () => {
      const response = await supertest(app).post('/').send(user);
      expect(response.statusCode).toEqual(201);
      expect(response.body.message).toEqual('User successfully created');
    });
    it('should return a 400 error if one or many fields are missing', async () => {
      const response = await supertest(app)
        .post('/')
        .send({ username: 'test' });
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('Missing data');
    });
    it('should return a 409 error if the user already exists', async () => {
      await UserModel.create(user);
      const response = await supertest(app).post('/').send(user);
      expect(response.statusCode).toEqual(409);
      expect(response.body.message).toEqual('Adresse email déjà utilisée');
    });
  });
  describe('Updating a user', () => {
    it('should return a success', async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app)
        .put('/')
        .send({ ...user, user: { id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual('User successfully updated');
    });
    it('should return a 404 error if the user is not found', async () => {
      const response = await supertest(app).put('/').send(user);
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('User not found');
    });
  });
  describe('Getting a user', () => {
    it('should return the user', async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app).get('/').send({ user: { id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body.user).toMatchObject({
        username: 'test',
        email: 'test@test.com',
      });
    });
    it('should return a 404 error if the user is not found', async () => {
      const response = await supertest(app).get('/');
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('User not found');
    });
  });
  describe('Deleting a user', () => {
    it('should return a success', async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app).delete('/').send({ user: { id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual('User successfully deleted');
    });
    it('should return a 404 error if the user is not found', async () => {
      const response = await supertest(app).delete('/');
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('User not found');
    });
  });
  describe('Logging in', () => {
    it('should return a jwt', async () => {
      await UserModel.create({
        ...user,
        password:
          '$2b$10$MWm26qRxIV6VsdF1h4cLEOQl6Q55JmbmrWrQv13fjrYGz1fE6oaXG',
      });
      const response = await supertest(app).post('/login').send(user);
      expect(response.statusCode).toEqual(200);
      expect(typeof response.body.token).toBeDefined();
    });
    it('should return a 404 error if the user is not found', async () => {
      const response = await supertest(app).post('/login').send(user);
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('Email invalide');
    });
    it('should return a 401 error if the password is invalid', async () => {
      await UserModel.create(user);
      const response = await supertest(app).post('/login').send(user);
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual('Mot de passe invalide');
    });
  });
  describe('Adding a bookmark', () => {
    it('should return a success', async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app).post('/bookmark').send({
        user: { id },
        id: '123',
        name: 'Restaurant',
        address: '1 place du capitole',
        lat: 12.34,
        lng: 12.34,
      });
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual('Bookmark successfully added');
    });
    it('should return a 400 error if one or many fields are missing', async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app).post('/').send({ user: { id } });
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('Missing data');
    });
    it('should return a 409 error if the bookmark is already added', async () => {
      const { id } = await UserModel.create(user);
      await supertest(app).post('/bookmark').send({
        user: { id },
        id: '123',
        name: 'Restaurant',
        address: '1 place du capitole',
        lat: 12.34,
        lng: 12.34,
      });
      const response = await supertest(app).post('/bookmark').send({
        user: { id },
        id: '123',
        name: 'Restaurant',
        address: '1 place du capitole',
        lat: 12.34,
        lng: 12.34,
      });
      expect(response.statusCode).toEqual(409);
      expect(response.body.message).toEqual('Bookmark already added');
    });
  });
  describe('Deleting a bookmark', () => {
    it('should return a success', async () => {
      const { id } = await UserModel.create(user);
      await supertest(app).post('/bookmark').send({
        user: { id },
        id: '123',
        name: 'Restaurant',
        address: '1 place du capitole',
        lat: 12.34,
        lng: 12.34,
      });
      const response = await supertest(app)
        .delete('/bookmark/123')
        .send({ user: { id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual('Bookmark successfully deleted');
    });
    it("should return a 404 error if the bookmark doesn't exist", async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app)
        .delete('/bookmark/123456')
        .send({ user: { id } });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('Bookmark not found');
    });
  });
  describe('Adding a booking', () => {
    it('should return a success', async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app)
        .post('/booking/123456')
        .send({ user: { id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual('Booking successfully added');
    });
    it('should return a 409 error if the booking is already added', async () => {
      const { id } = await UserModel.create(user);
      await supertest(app).post('/booking/123456').send({ user: { id } });
      const response = await supertest(app)
        .post('/booking/123456')
        .send({ user: { id } });
      expect(response.statusCode).toEqual(409);
      expect(response.body.message).toEqual('Booking already added');
    });
  });
  describe('Deleting a booking', () => {
    it('should return a success', async () => {
      const { id } = await UserModel.create(user);
      await supertest(app).post('/booking/123456').send({ user: { id } });
      const response = await supertest(app)
        .delete('/booking/123456')
        .send({ user: { id } });
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual('Booking successfully deleted');
    });
    it("should return a 404 error if the booking doesn't exist", async () => {
      const { id } = await UserModel.create(user);
      const response = await supertest(app)
        .delete('/booking/123456')
        .send({ user: { id } });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('Booking not found');
    });
  });
});
