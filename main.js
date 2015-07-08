'use strict';

const express = require('express');
const moment = require('moment');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());

app.get('/', function(req, res, next) {
  db('hits').count()
    .then(respond)
    .catch(next);

  function respond(rows) {
    res.json(rows[0].count);
  }
});

app.get('/count/:dimension/between/:t1/:t2', function(req, res, next) {
  const resolutions = { days: 'YYYY-MM-DD', hours: 'YYYY-MM-DD HH', minutes: 'YYYY-MM-DD HH:mm' };
  const resolution = resolutions[req.query.resolution] || resolutions.days;
  const filter = req.query.filter;
  const table = filter === 'students' ? 'student_counts' : filter === 'instructors' ? 'instructor_counts' : 'counts';
  const params = req.params;
  const dimension = params.dimension;
  const t2 = moment(params.t2).add(1, 'days').format(resolutions.days);

  db(table)
    .select('time', params.dimension)
    .where('time', '>=', params.t1).andWhere('time', '<', t2)
    .orderBy('time')
    .then(resolve)
    .then(respond)
    .catch(next);

  function resolve(rows) {
    const units = {};

    rows.forEach(function(row) {
      const unit = moment(row.time).format(resolution);
      units[unit] = (units[unit] || 0) + row[dimension];
    });

    return Object.keys(units).map(function(unit) {
      const row = { time: unit };
      row[dimension] = units[unit];
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
