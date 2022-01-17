const express = require('express');
const { getReviews } = require('../helpers/getReviews');
const { getReviewsMeta } = require('../helpers/getReviewsMeta');
const { postReviews } = require('../helpers/postReviews');
const { markHelpful, reportReview } = require('../helpers/putReviews');
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

app.put('/reviews/:review_id/helpful', (req, res) => {
  markHelpful(req, res);
});

app.put('/reviews/:review_id/report', (req, res) => {
  reportReview(req, res);
});

app.listen(port, () => {
  console.log('Server is now listening at port ', port);
});
