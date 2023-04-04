const app = require('./server');

app.listen(3000, (err) => {
  if (err) console.log('An error occured');
  else
    console.log(
      'You can access restaurants API at http://restaurant-service:3000',
    );
});
