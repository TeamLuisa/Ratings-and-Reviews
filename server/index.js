const express = require('express');
const { getReviews } = require('../helpers/middleware');
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
