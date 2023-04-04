const express = require('express');

const router = express.Router();

const { createRating, getRatings } = require('./rating');

router.post('/', async (req, res) => {
  const response = await createRating(req);
  res.status(response.status).send(response.data);
});

router.get('/', async (req, res) => {
  const response = await getRatings(req);
  res.status(response.status).send(response.data);
});

module.exports = router;
