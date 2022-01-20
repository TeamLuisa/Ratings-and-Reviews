require('newrelic');
const express = require('express');
const compression = require('compression');
const { getReviews, getReviewsBis } = require('../helpers/getReviews');
const { getReviewsMeta, getReviewsMetaBis1, getReviewsMetaBis2 } = require('../helpers/getReviewsMeta');
const { postReviews } = require('../helpers/postReviews');
const { markHelpful, reportReview } = require('../helpers/putReviews');
// const db = require('../database/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

const port = 3300;

// db.connect();

app.get('/reviews', (req, res) => {
  getReviews(req, res);
});

/* ----- Alternate GET /reviews route ----- */
app.get('/reviewsbis', (req, res) => {
  getReviewsBis(req, res);
});
/* ----- End of alternate GET /reviews route ----- */

app.get('/reviews/meta', (req, res) => {
  getReviewsMeta(req, res);
});

/* ----- Alternate GET /reviews/meta routes ----- */
app.get('/reviews/metabis1', (req, res) => {
  getReviewsMetaBis1(req, res);
});

app.get('/reviews/metabis2', (req, res) => {
  getReviewsMetaBis2(req, res);
});
/* ----- End of alternate GET /reviews/meta routes ----- */

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
