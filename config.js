'use strict';

const config = {
  db: {
    debug: !!process.env.DEBUG,
    client: 'pg',
    connection: {
      user: 'root',
      password: 'root',
      database: 'root'
    }
  }
};

module.exports = config;
