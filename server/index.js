const express = require('express');
const { getReviews } = require('../helpers/getReviews');
const { getReviewsMeta } = require('../helpers/getReviewsMeta');
const db = require('../database/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3300;

// db.connect();

app.get('/reviews', async (req, res) => {
  getReviews(req, res);
});

app.get('/reviews/meta', async (req, res) => {
  getReviewsMeta(req, res);
});

app.get('/photos', async (req, res) => {
  const get = 'SELECT * FROM reviews_photos LIMIT 15';
  const results = await db.query(get);
  res.send(results);
});

app.listen(port, () => {
  console.log('Server is now listening at port ', port);
});
