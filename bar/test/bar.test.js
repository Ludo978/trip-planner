const app = require('../src/server');
const supertest = require('supertest');

describe('The bar service', () => {
  describe('Getting bars', () => {
    it('should return an array of bars', async () => {
      const response = await supertest(app).get('?city=toulouse');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('bars');
      expect(response.body.bars[0]).toHaveProperty(
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
