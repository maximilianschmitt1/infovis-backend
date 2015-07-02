'use strict';

exports.up = function(knex) {
  return createFacultiesTable().then(createCoursesTable).then(createHitsTable);

  function createFacultiesTable() {
    return knex.schema.createTable('faculties', function(table) {
      table.increments('id');
      table.string('name');
    });
  }

  function createCoursesTable() {
    // courses can be assigned to multiple faculties, e.g.
    // Mathematik: Mathematik für Medieninformatik II (SS 2015)
    // and
    // Sprach-, Literatur- und Kulturwissenschaften: Mathematik für Medieninformatik II (SS 2015)
    return knex.schema.createTable('courses', function(table) {
      table.unique(['id', 'faculty_id']);
      table.integer('id');
      table.integer('faculty_id').references('id').inTable('faculties');
      table.string('name');
    });
  }

  function createHitsTable() {
    return knex.schema.createTable('hits', function(table) {
      table.integer('id').unique();
      table.integer('course_id');
      table.dateTime('time');
      table.string('full_name');
      table.string('ip');
      table.string('context');
      table.integer('context_id');
      table.string('action');
      table.string('url');
    });
  }
};

exports.down = function(knex) {
  return dropHitsTable().then(dropCoursesTable).then(dropFacultiesTable);

  function dropFacultiesTable() {
    return knex.schema.dropTable('faculties');
  }

  function dropCoursesTable() {
    return knex.schema.dropTable('courses');
  }

  function dropHitsTable() {
    return knex.schema.dropTable('hits');
  }
};
