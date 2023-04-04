const app = require('../src/server');
const supertest = require('supertest');

describe('The event service', () => {
  describe('Getting events', () => {
    it('should return events', async () => {
      const response = await supertest(app).get('/events?city=toulouse');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('events');
      expect(response.body.events[0]).toHaveProperty(
        'id',
        'name',
        'description',
        'url',
        'image',
        'date',
        'location',
        'price',
      );
    });
  });

  describe('Getting events places', () => {
    it('should return an array of places', async () => {
      const response = await supertest(app).get('/places?city=toulouse');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('places');
      expect(response.body.places[0]).toHaveProperty(
        'id',
        'name',
        'address',
        'lat',
        'lng',
      );
    });
    it('should return an error if no city is provided', async () => {
      const response = await supertest(app).get('/places');
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('No city provided');
    });
  });
  describe('Getting similar places', () => {
    it('should return an array of places', async () => {
      const response = await supertest(app).get('/4bb981e7cf2fc9b6ef9aa002');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('places');
      expect(response.body.places[0]).toHaveProperty(
        'id',
        'name',
        'address',
        'lat',
        'lng',
      );
    });
    it('should return a 404 error if no places are found', async () => {
      const response = await supertest(app).get('/123456789');
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('Aucun lieu trouvé');
    });
  });
});
