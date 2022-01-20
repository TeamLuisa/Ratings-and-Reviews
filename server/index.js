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

app.get('/reviews', getReviews);

/* ----- Alternate GET /reviews route ----- */
app.get('/reviewsbis', getReviewsBis);
/* ----- End of alternate GET /reviews route ----- */

app.get('/reviews/meta', getReviewsMeta);

/* ----- Alternate GET /reviews/meta routes ----- */
app.get('/reviews/metabis1', getReviewsMetaBis1);

app.get('/reviews/metabis2', getReviewsMetaBis2);
/* ----- End of alternate GET /reviews/meta routes ----- */

app.post('/reviews', postReviews);

app.put('/reviews/:review_id/helpful', markHelpful);

app.put('/reviews/:review_id/report', reportReview);

app.listen(port, () => {
  console.log('Server is now listening at port ', port);
});
