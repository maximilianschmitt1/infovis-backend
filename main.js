'use strict';

const express = require('express');
const db = require('./db');
const app = express();

app.get('/', function(req, res, next) {
  db('hits').count()
    .then(respond)
    .catch(next);

  function respond(rows) {
    res.send(rows[0].count);
  }
});

app.use(function(err, req, res, next) {
  res.status(500).send('Error');
  console.log(err.stack || err);
  process.exit(1);
});

app.listen(process.env.PORT || 3000);
