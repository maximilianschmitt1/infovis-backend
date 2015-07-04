
exports.up = function(knex, Promise) {
  return knex.raw('CREATE INDEX ON hits ("time");');
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP INDEX hits_time_idx');
};
