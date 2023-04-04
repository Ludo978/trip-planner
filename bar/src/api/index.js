const express = require('express');

const router = express.Router();

const { get } = require('./bar');

router.get('/', async (req, res) => {
  const response = await get(req);
  res.status(response.status).send(response.data);
});

module.exports = router;
