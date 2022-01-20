/* eslint-disable camelcase */
const db = require('../database/index');

module.exports.postReviews = async (req, res) => {
  const {
    product_id, rating, summary, body, recommend, name, email, photos, characteristics,
  } = req.body;
  const date = Math.floor(new Date().getTime() / 1000);
  const charIDs = Object.keys(characteristics).map(Number);
  const charValues = Object.values(characteristics);
  const inputValues = [product_id, rating, date, summary, body, recommend, name,
    email, photos, charIDs, charValues];

  let insertQuery = '';

  if (photos.length > 0) {
    if (charIDs.length > 0) {
      insertQuery = `WITH
        review_insert AS (
          INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
          VALUES( $1, $2, $3, $4, $5, $6, DEFAULT, $7, $8, NULL, DEFAULT )
          RETURNING id
        ),
        reviews_photos_insert AS (
          INSERT INTO reviews_photos(review_id, url)
          VALUES( (SELECT id FROM review_insert), UNNEST($9) )
          RETURNING id
        )
        INSERT INTO characteristic_reviews(characteristic_id, review_id, value)
        VALUES( UNNEST($10), (SELECT id FROM review_insert), UNNEST($11) )`;
    } else {
      insertQuery = `WITH
        review_insert AS (
          INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
          VALUES( $1, $2, $3, $4, $5, $6, DEFAULT, $7, $8, NULL, DEFAULT )
          RETURNING id
        )
        INSERT INTO reviews_photos(review_id, url)
        VALUES( (SELECT id FROM review_insert), UNNEST($9) )
        RETURNING id`;
    }
  } else if (photos.length === 0) {
    if (charIDs.length > 0) {
      insertQuery = `WITH
        review_insert AS (
          INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
          VALUES( $1, $2, $3, $4, $5, $6, DEFAULT, $7, $8, NULL, DEFAULT )
          RETURNING id
        )
        INSERT INTO characteristic_reviews(characteristic_id, review_id, value)
        VALUES( UNNEST($10), (SELECT id FROM review_insert), UNNEST($11) )`;
    } else {
      insertQuery = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES( $1, $2, $3, $4, $5, $6, DEFAULT, $7, $8, NULL, DEFAULT )`;
    }
  }

  await db.query(insertQuery, inputValues);
  await res.send('Created');
};

/* ---------- Used for testing and finding bugs ---------- */
// module.exports.playFunc = async (req, res) => {
//   const {
//     product_id, rating, summary, body, recommend, name, email, photos, characteristics,
//   } = req.body;
//   const date = 1067343265;
//   const inputValues = [product_id, rating, date, summary, body, recommend, name, email];

//   const insQ = `INSERT INTO r1(product_id, rating, date, summary, body, recommend, reported,
//   reviewer_name, reviewer_email, response, helpfulness) VALUES($1, $2, $3, $4, $5, $6,
//   DEFAULT, $7, $8, NULL, DEFAULT)`;

//   await db.query(insQ, inputValues);
//   await res.send('Welp');
// };
