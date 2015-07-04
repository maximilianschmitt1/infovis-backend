'use strict';

const express = require('express');
const moment = require('moment');
const db = require('./db');
const app = express();

app.get('/', function(req, res, next) {
  db('hits').count()
    .then(respond)
    .catch(next);

  function respond(rows) {
    res.json(rows[0].count);
  }
});

app.get('/count/:what/between/:t1/:t2', function(req, res, next) {
  const resolutions = {
    days: 'YYYY-MM-DD',
    hours: 'YYYY-MM-DD HH',
    minutes: 'YYYY-MM-DD HH:mm'
  };
  const resolution = resolutions[req.query.resolution] || resolutions.days;
  const params = req.params;
  const what = params.what;

  db('counts')
    .select('time', params.what)
    .where('time', '>=', params.t1).andWhere('time', '<', params.t2)
    .orderBy('time')
    .then(resolve)
    .then(respond)
    .catch(next);

  function resolve(rows) {
    const units = {};

    rows.forEach(function(row) {
      const unit = moment(row.time).format(resolution);
      units[unit] = (units[unit] || 0) + row[what];
    });

    return Object.keys(units).map(function(unit) {
      const row = { time: unit };
      row[what] = units[unit];
      return row;
    });
  }

  function respond(rows) {
    res.json(rows);
  }
});

app.use(function(err, req, res, next) {
  res.status(500).send('Error');
  console.log(err.stack || err);
  process.exit(1);
});

app.listen(process.env.PORT || 3000);
