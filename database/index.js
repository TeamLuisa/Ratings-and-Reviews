const pgp = require('pg-promise')();

const credentials = {
  // host: 'localhost',
  host: 'ec2-18-206-229-100.compute-1.amazonaws.com',
  port: 5432,
  database: 'ratings_and_reviews',
  user: 'username',
  // password: '',
  password: 'password',
};

const db = pgp(credentials);

module.exports = db;
