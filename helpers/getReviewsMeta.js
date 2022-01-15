// Handles GET requests to /reviews/meta
// Query params: product_id
const db = require('../database/index');

module.exports.getReviewsMeta = async (req, res) => {
  const productId = req.query.product_id;

  const data = {
    product_id: String(productId),
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  const getQueryA = `SELECT JSON_BUILD_ARRAY(ratings_and_recs_MV.true, ratings_and_recs_MV.false) AS recommended, JSON_BUILD_ARRAY(one, two, three, four, five) AS ratings FROM ratings_and_recs_MV WHERE product_id = ${productId}`;

  const resultsA = await db.query(getQueryA);
  for (let i = 0; i < resultsA[0].ratings.length; i += 1) {
    if (resultsA[0].ratings[i] !== 0) {
      data.ratings[String(i + 1)] = resultsA[0].ratings[i];
    }
  }

  [data.recommended.true, data.recommended.false] = resultsA[0].recommended;

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
