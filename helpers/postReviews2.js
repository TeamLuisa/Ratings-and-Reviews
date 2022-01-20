/* eslint-disable camelcase */
// Handles POST requests of a Review to the server & DB
// Body params: product_id, rating, summary, body, recommend, name, email, photos, characteristics

const db = require('../database/index');

module.exports.postReviews = async (req, res) => {
  const {
    product_id, rating, summary, body, recommend, name, email, photos, characteristics,
  } = req.body;
  const date = Math.floor(new Date().getTime() / 1000);
  const reported = false;
  const response = null;
  const helpfulness = 0;
  // const reviewDetails = [product_id, rating, date, summary, body, recommend, reported, name,
  //   email, response, helpfulness];

  const insertReview = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${product_id}, ${rating}, ${date}, ${summary}, ${body}, ${recommend}, ${reported}, ${name}, ${email}, ${response}, ${helpfulness}) RETURNING id`;

  const reviewId = await db.query(insertReview);

  /* ----- Insert photo urls into reviews_photos ----- */
  if (photos.length > 0) {
    const queries = photos.map((url) => {
      const q = `INSERT INTO reviews_photos (review_id, url) VALUES (${reviewId}, ${url})`;
      return q;
    });
    await Promise.all(queries.map((insertQuery) => db.query(insertQuery)));
  }

  // for (let i = 0; i < photos.length; i += 1) {
  //   const insertPhotos = `INSERT INTO reviews_photos (review_id, url)
  // VALUES (${reviewId + i}, ${photos[i]})`;
  //   queries.push(insertPhotos);
  // }

  /* ----- Insert into characteristics_reviews table ----- */
  const charIDs = Object.keys(characteristics);
  if (charIDs.length !== 0) {
    const queries = charIDs.map((id) => {
      const q = `INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
      VALUES (${Number(id)}, ${reviewId}, ${characteristics[id]})`;
      return q;
    });
    await Promise.all(queries.map((insQuery) => db.query(insQuery)));
  }

  res.send('CREATED');
};
