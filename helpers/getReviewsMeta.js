// Handles GET requests to /reviews/meta
// Query params: product_id
const db = require('../database/index');

module.exports.getReviewsMeta = async (req, res) => {
  const productId = req.query.product_id;
  const getQuery = `SELECT * FROM characteristics WHERE product_id = ${productId} LIMIT 15`;
  const results = await db.query(getQuery);
  res.send(results);
};
