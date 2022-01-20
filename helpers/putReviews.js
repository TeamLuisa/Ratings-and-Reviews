const db = require('../database/index');

/* ----- PUT request to /reviews/:review_id/helpful --- */
// To mark review as helpful --- params: review_id
module.exports.markHelpful = async (req, res) => {
  const reviewId = req.params.review_id;
  const updateQuery = `UPDATE reviews
  SET helpfulness = helpfulness + 1
  WHERE id = ${reviewId}`;

  await db.query(updateQuery);
  await res.send('Updated');
};

/* ----- PUT request to /reviews/:review_id/report ----- */
// Reports a review --- params: review_id
module.exports.reportReview = async (req, res) => {
  const reviewId = req.params.review_id;
  const updateQuery = `UPDATE reviews
  SET reported = true
  WHERE id = ${reviewId}`;

  await db.query(updateQuery);
  await res.send('Updated');
};
