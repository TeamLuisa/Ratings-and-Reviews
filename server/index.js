const express = require('express');
const { getReviews } = require('../helpers/getReviews');
const { getReviewsMeta } = require('../helpers/getReviewsMeta');
const { postReviews, playFunc } = require('../helpers/postReviews');
// const db = require('../database/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3300;

// db.connect();

app.get('/reviews', (req, res) => {
  getReviews(req, res);
});

app.get('/reviews/meta', (req, res) => {
  getReviewsMeta(req, res);
});

app.post('/reviews', (req, res) => {
  postReviews(req, res);
});

// app.post('/testing', (req, res) => {
//   playFunc(req, res);
// });

app.listen(port, () => {
  console.log('Server is now listening at port ', port);
});
