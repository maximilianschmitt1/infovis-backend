'use strict';

const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    user: 'root',
    password: 'root',
    database: 'root'
  }
});

module.exports = db;
