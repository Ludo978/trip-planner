const app = require('./server');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://mongo-rating:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(3000, (err) => {
      if (err) console.log('An error occured');
      else
        console.log('You can access rating API at http://rating-service:3000');
    }),
  );
