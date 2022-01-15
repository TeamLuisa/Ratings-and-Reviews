// Handles GET requests to /reviews
// Query params:
//   page (default: 1), count (default: 5), sort (by 'newest', 'helpful', 'relevant'), product_id
const db = require('../database/index');

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

  const getQuery1 = `SELECT
  JSON_AGG(JSON_BUILD_OBJECT('review_id', id, 'rating', rating, 'summary', summary,
  'recommend', recommend, 'response', response, 'body', body, 'date', TO_TIMESTAMP( date/1000 ),
  'reviewer_name', reviewer_name, 'helpfulness', helpfulness) ORDER BY ${sortBy}) AS results FROM reviews
  WHERE product_id = ${productId} AND reported = false GROUP BY product_id LIMIT ${page * count}`;

  // const getQuery = `SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response,
  // r.body, TO_TIMESTAMP( r.date/1000 ) AS date, r.reviewer_name, r.helpfulness,
  // JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'url', p.url)) AS photos FROM reviews r JOIN
  // reviews_photos p ON p.review_id = r.id WHERE r.product_id = ${productId} GROUP BY
  // (r.id, r. rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name,
  // r.helpfulness)`;

  const queryOutput = await db.query(getQuery1);
  const { results } = queryOutput[0];
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

  data.results = results;
  res.send(data);
};
