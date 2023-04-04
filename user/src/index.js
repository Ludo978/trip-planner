const app = require('./server');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://mongo-user:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(3000, (err) => {
      if (err) console.log('An error occured');
      else console.log('You can access user API at http://user-service:3000');
    }),
  );
