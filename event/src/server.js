const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(api);

module.exports = app;
