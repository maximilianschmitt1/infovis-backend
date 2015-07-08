'use strict';

const actionContextTypes = require('./action-context-types.json');

exports.up = function(knex, Promise) {
  return knex.schema.createTable('counts', function(table) {
    table.dateTime('time').unique().primary();
    table.integer('uniques').defaultTo(0);
    table.integer('hits').defaultTo(0);

    actionContextTypes.forEach(function(row) {
      const context = row[0][0];
      const action = row[0][1].replace(' ', '_');
      table.integer(context + ':' + action).defaultTo(0);
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('counts');
};
