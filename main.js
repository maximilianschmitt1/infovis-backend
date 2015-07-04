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

app.get('/uniques/between/:t1/:t2', function(req, res, next) {
  const minres = 'extract(year from "time"), extract(month from "time"), extract(day from "time")';
  const resolutions = {
    days: minres,
    hours: `${minres}, extract(hour from "time")`,
    minutes: `${minres}, extract(hour from "time"), extract(minute from "time")`
  };

  const params = req.params;
  const resolution = resolutions[req.query.resolution] || resolution.days;

  db('hits')
    .select(db.raw(`${resolution}, count(distinct "full_name")`))
    .where('time', '>=', params.t1).andWhere('time', '<', params.t2)
    .groupByRaw(resolution)
    .options({ rowMode: 'array' })
    .then(respond)
    .catch(next);

  function respond(rows) {
    res.json(rows);
  }
});

app.get('/hits/between/:t1/:t2', function(req, res, next) {
  const params = req.params;
  const t1 = moment(new Date(params.t1));
  const t2 = moment(new Date(params.t2));

  db('hits').count().whereBetween('time', [t1, t2])
    .then(respond)
    .catch(next);

  function respond(rows) {
    res.json(rows[0]);
  }
});

app.use(function(err, req, res, next) {
  res.status(500).send('Error');
  console.log(err.stack || err);
  process.exit(1);
});

app.listen(process.env.PORT || 3000);
