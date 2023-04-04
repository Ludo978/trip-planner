const express = require('express');

const router = express.Router();

const { getEvents, getPlaces, getSimilar } = require('./event');

router.get('/events', async (req, res) => {
  const response = await getEvents(req);
  res.status(response.status).send(response.data);
});

router.get('/places', async (req, res) => {
  const response = await getPlaces(req);
  res.status(response.status).send(response.data);
});

router.get('/:id', async (req, res) => {
  const response = await getSimilar(req);
  res.status(response.status).send(response.data);
});

module.exports = router;
