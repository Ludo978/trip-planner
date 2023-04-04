const app = require('./server');

app.listen(3000, (err) => {
  if (err) console.log('An error occured');
  else console.log('You can access bars API at http://bar-service:3000');
});
