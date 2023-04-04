const app = require('../src/server');
const supertest = require('supertest');

describe('The hotel service', () => {
  describe('Getting hotels', () => {
    it('should return an array of hotels', async () => {
      const response = await supertest(app).get('?city=toulouse');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('hotels');
      expect(response.body.hotels[0]).toHaveProperty(
        'id',
        'name',
        'address',
        'lat',
        'lng',
      );
    });
    it('should return an error if no city is provided', async () => {
      const response = await supertest(app).get('/');
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('No city provided');
    });
  });
});
