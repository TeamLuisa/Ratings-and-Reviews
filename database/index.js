const pgp = require('pg-promise')();

const credentials = {
  host: 'localhost',
  port: 5432,
  database: 'ratings_and_reviews',
  user: 'wisdomibole',
  password: '',
};

const db = pgp(credentials);

module.exports = db;
