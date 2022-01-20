// Handles GET requests to /reviews/meta
// Query params: product_id
const db = require('../database/index');

/* ----- Queries the DB using ONE query and Materialized Views ----- */
module.exports.getReviewsMeta = async (req, res) => {
  const productId = req.query.product_id;

  const data = {
    product_id: String(productId),
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  const getQueryA = `SELECT
  JSON_BUILD_OBJECT(
    '1', rr.one, '2', rr.two, '3', rr.three, '4', rr.four, '5', rr.five
  ) AS ratings,
  JSON_BUILD_OBJECT(
    'true', rr.true,
    'false', rr.false
  ) AS recommended,
  JSON_OBJECT_AGG(c.name, JSON_BUILD_OBJECT(
    'id', c.char_id,
    'value', TO_CHAR(c.avg, 'FM9.9990')
  )) AS characteristics
  FROM characteristics_MV c
  LEFT JOIN ratings_and_recs_MV rr ON rr.product_id = c.product_id
  WHERE c.product_id = ${productId}
  GROUP BY c.product_id, rr.one, rr.two, rr.three, rr.four, rr.five, rr.true, rr.false;`;

  const results = await db.query(getQueryA);

  if (results.length > 0) {
    const ratingsKeys = ['1', '2', '3', '4', '5'];
    const ratingsObject = results[0].ratings;

    for (let i = 0; i < ratingsKeys.length; i += 1) {
      if (ratingsObject[ratingsKeys[i]] !== 0) {
        data.ratings[ratingsKeys[i]] = ratingsObject[ratingsKeys[i]];
      }
    }

    data.recommended = results[0].recommended;
    data.characteristics = results[0].characteristics;
  }

  res.send(data);
};

/* ----- Queries the DB using TWO queries and Materialized Views ----- */
module.exports.getReviewsMetaBis1 = async (req, res) => {
  const productId = req.query.product_id;
  const data = {
    product_id: String(productId),
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  const getQueryA = `SELECT JSON_BUILD_ARRAY(ratings_and_recs_MV.true, ratings_and_recs_MV.false) AS recommended, JSON_BUILD_ARRAY(one, two, three, four, five) AS ratings FROM ratings_and_recs_MV WHERE product_id = ${productId}`;

  const resultsA = await db.query(getQueryA);

  if (resultsA.length !== 0) {
    for (let i = 0; i < resultsA[0].ratings.length; i += 1) {
      if (resultsA[0].ratings[i] !== 0) {
        data.ratings[String(i + 1)] = resultsA[0].ratings[i];
      }
    }

    [data.recommended.true, data.recommended.false] = resultsA[0].recommended;
  }

  const getQueryB = `SELECT JSON_AGG(JSON_BUILD_OBJECT(characteristics_MV.name, JSON_BUILD_OBJECT('id', char_id, 'value', TO_CHAR(avg, 'FM9.9990')))) AS content
   FROM characteristics_MV WHERE product_id = ${productId}`;

  const resultsB = await db.query(getQueryB);
  const content = resultsB[0].content || [];

  for (let j = 0; j < content.length; j += 1) {
    const key = Object.keys(content[j])[0];
    data.characteristics[key] = content[j][key];
  }

  res.send(data);
};

/* ----- Directly queries tables; no Materialized Views; slow ----- */
module.exports.getReviewsMetaBis2 = async (req, res) => {
  const productId = req.query.product_id;
  const data = {
    product_id: String(productId),
  };

  const getQuery = `SELECT
  JSON_BUILD_OBJECT(
    '1', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${productId} AND rating = 1),
    '2', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${productId} AND rating = 2),
    '3', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${productId} AND rating = 3),
    '4', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${productId} AND rating = 4),
    '5', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${productId} AND rating = 5)
  ) AS ratings,
  JSON_BUILD_OBJECT(
    'true', (SELECT COUNT(recommend) FROM reviews WHERE product_id = ${productId} AND recommend = true),
    'false', (SELECT COUNT(recommend) FROM reviews WHERE product_id = ${productId} AND recommend = false)
  ) AS recommended,
  JSON_OBJECT_AGG(characteristics.name, JSON_BUILD_OBJECT(
    'id', characteristic_reviews.id,
    'value', (SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_reviews.characteristic_id = characteristics.id)
  )) AS characteristics
  FROM reviews
  LEFT JOIN characteristics ON characteristics.product_id = reviews.product_id
  LEFT JOIN characteristic_reviews ON characteristic_reviews.characteristic_id = characteristics.id
  WHERE reviews.product_id = ${productId}
  GROUP BY reviews.product_id;
  `;

  const results = await db.query(getQuery);
  data.ratings = results[0].ratings;
  data.recommended = results[0].recommended;
  data.characteristics = results[0].characteristics;
  await res.send(data);
};
