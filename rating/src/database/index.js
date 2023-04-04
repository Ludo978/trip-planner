const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    placeId: String,
    authorId: String,
    value: Number,
    comment: String,
  },
  { timestamps: true },
);

const RatingModel = mongoose.model('rating', ratingSchema);

module.exports = { RatingModel };
