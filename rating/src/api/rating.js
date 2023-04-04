const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { RatingModel } = require('../database');

const createRating = async ({ body }) => {
  const { placeId, value, comment } = body;
  const authorId = body.user?.id;

  if (!placeId || !authorId || !value || !comment)
    return {
      status: 400,
      data: { message: 'Missing data' },
    };

  const existingRating = await RatingModel.findOne({ placeId, authorId });
  if (existingRating) {
    return {
      status: 409,
      data: { message: 'Rating already exists' },
    };
  }

  let rating;
  try {
    rating = await RatingModel.create(body);
  } catch (error) {
    console.log(error);
  }
  if (rating)
    return { status: 201, data: { message: 'Rating successfully created' } };
  else return { status: 500, data: { message: 'An error occured' } };
};

const getRatings = async ({ query }) => {
  let ratings;

  try {
    ratings = await RatingModel.find(query, '-__v');
  } catch (error) {
    console.log(error);
  }
  return { status: 200, data: { ratings } };
};

module.exports = {
  createRating,
  getRatings,
};
