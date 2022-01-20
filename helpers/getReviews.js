// Handles GET requests to /reviews
// Query params:
//   page (default: 1), count (default: 5), sort (by 'newest', 'helpful', 'relevant'), product_id
const db = require('../database/index');

/* ----- Queries the DB using TWO queries, one of which is looped through ----- */
module.exports.getReviews = async (req, res) => {
  const productId = req.query.product_id; // required
  const page = req.query.page || 1; // not required
  const count = req.query.count || 5; // not required
  const sort = req.query.sort || 'newest'; // not required
  let sortBy = 'date DESC';

  if (sort === 'helpful') {
    sortBy = 'helpfulness DESC';
  }
  if (sort === 'relevant') {
    sortBy = 'helpfulness DESC, date DESC';
  }

  const data = {
    product_id: productId,
    page: page - 1,
    count,
  };

  const getQuery1 = `SELECT JSON_AGG (JSON_BUILD_OBJECT (
    'review_id', id, 'rating', rating, 'summary', summary, 'recommend', recommend,
    'response', response, 'body', body, 'date', TO_TIMESTAMP( date/1000 ),
    'reviewer_name', reviewer_name, 'helpfulness', helpfulness
  )
  ORDER BY ${sortBy}) AS results
  FROM reviews
  WHERE product_id = ${productId} AND reported = false
  GROUP BY product_id LIMIT ${page * count}`;

  const queryOutput = await db.query(getQuery1);
  // const { results } = queryOutput.length === 0 ? [] : queryOutput[0];
  const results = queryOutput.length === 0 ? [] : queryOutput[0].results;
  const queries = [];

  for (let i = 0; i < results.length; i += 1) {
    results[i].photos = [];

    const getPhotosQuery = `SELECT JSON_AGG (JSON_BUILD_OBJECT (
      'id', p.id, 'url', p.url
    )) AS photos
    FROM reviews r RIGHT JOIN reviews_photos p ON p.review_id = r.id
    WHERE p.review_id = ${results[i].review_id}
    GROUP BY p.review_id`;

    queries.push(getPhotosQuery);
  }

  const returnedURLs = await Promise.all(queries.map((getPhotosQuery) => db.query(getPhotosQuery)));
  returnedURLs.map((url, i) => {
    if (url.length > 0) {
      results[i].photos = results[i].photos.concat(url[0].photos);
    }
  });

  data.results = results;
  res.send(data);
};

/* ----- [INCOMPLETE] Queries the DB using ONE query ----- */
module.exports.getReviewsBis = async (req, res) => {
  const productId = req.query.product_id; // required
  const page = req.query.page || 1; // not required
  const count = req.query.count || 5; // not required
  const sort = req.query.sort || 'newest'; // not required
  let sortBy = 'date DESC';

  if (sort === 'helpful') {
    sortBy = 'helpfulness DESC';
  }
  if (sort === 'relevant') {
    sortBy = 'helpfulness DESC, date DESC';
  }

  const data = {
    product_id: productId,
    page: page - 1,
    count,
  };

  const que = `SELECT
  JSON_AGG(JSON_BUILD_OBJECT(
    'id', (SELECT rp.id FROM reviews_photos rp RIGHT JOIN reviews r ON rp.review_id = r.id WHERE rp.review_id = r.id),
    'url', (SELECT rp.url FROM reviews_photos rp RIGHT JOIN reviews r ON rp.review_id = r.id WHERE rp.review_id = r.id)
  )) AS photos
  `;

  const getQuery1 = `SELECT
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend,
      'response', r.response, 'body', r.body, 'date', TO_TIMESTAMP( r.date/1000 ),
      'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness,
      JSON_AGG(JSON_BUILD_OBJECT(
        'id', (SELECT rp.id FROM rp WHERE rp.review_id = r.id),
        'url', (SELECT rp.url FROM rp WHERE rp.review_id = r.id)
      )) AS photos
    ) ORDER BY ${sortBy}
  ) AS results
  FROM reviews r RIGHT JOIN reviews_photos rp ON rp.review_id = r.id
  WHERE r.product_id = ${productId} AND r.reported = false
  GROUP BY r.product_id, rp.review_id
  LIMIT ${page * count};`;

  // const queryOutput = await db.query(getQuery1);

  const abe = await db.query(que);
  console.log('Abe:', abe);

  const results = queryOutput.length === 0 ? [] : queryOutput[0].results;
  const queries = [];

  for (let i = 0; i < results.length; i += 1) {
    results[i].photos = [];

    const getPhotosQuery = `SELECT JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'url', p.url)) AS photos
    FROM reviews r RIGHT JOIN reviews_photos p ON p.review_id = r.id
    WHERE p.review_id = ${results[i].review_id} GROUP BY p.review_id`;

    queries.push(getPhotosQuery);
  }

  const returnedURLs = await Promise.all(queries.map((getPhotosQuery) => db.query(getPhotosQuery)));
  returnedURLs.map((url, i) => {
    if (url.length > 0) {
      results[i].photos = results[i].photos.concat(url[0].photos);
    }
  });

  // data.results = results;
  // res.send(data);
};
