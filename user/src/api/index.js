const express = require('express');

const router = express.Router();

const {
  createUser,
  updateUser,
  getProfile,
  deleteUser,
  login,
  addBookmark,
  deleteBookmark,
  addBooking,
  deleteBooking,
} = require('./user');

router.post('/', async (req, res) => {
  const response = await createUser(req);
  res.status(response.status).send(response.data);
});

router.put('/', async (req, res) => {
  const response = await updateUser(req);
  res.status(response.status).send(response.data);
});

router.get('/', async (req, res) => {
  const response = await getProfile(req);
  res.status(response.status).send(response.data);
});

router.delete('/', async (req, res) => {
  const response = await deleteUser(req);
  res.status(response.status).send(response.data);
});

router.post('/login', async (req, res) => {
  const response = await login(req);
  res.status(response.status).send(response.data);
});

router.post('/bookmark', async (req, res) => {
  const response = await addBookmark(req);
  res.status(response.status).send(response.data);
});

router.delete('/bookmark/:id', async (req, res) => {
  const response = await deleteBookmark(req);
  res.status(response.status).send(response.data);
});

router.post('/booking/:id', async (req, res) => {
  const response = await addBooking(req);
  res.status(response.status).send(response.data);
});

router.delete('/booking/:id', async (req, res) => {
  const response = await deleteBooking(req);
  res.status(response.status).send(response.data);
});

module.exports = router;
