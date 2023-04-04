const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  zipcode: String,
  city: String,
  country: String,
});

const bookmarkSchema = new mongoose.Schema({
  id: String,
  name: String,
  address: String,
  lat: String,
  lng: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bookmarks: [bookmarkSchema],
  bookingIds: [String],
  address: addressSchema,
});

const UserModel = mongoose.model('user', userSchema);

module.exports = { UserModel };
