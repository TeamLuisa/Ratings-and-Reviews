const express = require('express');
const db = require('../database/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3300;

// db.connect();
// const productIdAdjustor = 40343;

app.get('/reviews', async (req, res) => {
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
  WHERE product_id = ${productId} GROUP BY product_id LIMIT ${page * count}`;

  const getQuery = `SELECT r.id AS review_id, r.rating, r.summary, r.recommend, r.response, r.body,
  TO_TIMESTAMP( r.date/1000 ) AS date, r.reviewer_name, r.helpfulness,
  JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'url', p.url)) AS photos FROM reviews r JOIN reviews_photos p
  ON p.review_id = r.id WHERE r.product_id = ${productId} GROUP BY (r.id, r. rating, r.summary,
  r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness)`;

  const queryOutput = await db.query(getQuery1);
  data.results = queryOutput[0].results;
  res.send(data);
});

app.get('/reviews/meta', async (req, res) => {
  // const productId = req.query.product_id;
  // const page = req.query.page || 1;
  // const count = req.query.count || 5;
  // const getQuery = `SELECT ${productId} AS product_id FROM product LIMIT 25`;
  const getQuery = `SELECT JSON_AGG(JSON_BUILD_OBJECT('id', p.id, 'url', p.url)) AS photos
  FROM reviews r RIGHT JOIN reviews_photos p ON p.review_id = r.id WHERE p.review_id = 5
  GROUP BY p.review_id`;
  const results = await db.query(getQuery);
  res.send(results);
});

app.get('/photos', async (req, res) => {
  const get = 'SELECT * FROM reviews_photos LIMIT 15';
  const results = await db.query(get);
  res.send(results);
});

app.listen(port, () => {
  console.log('Server is now listening at port ', port);
});
