const express = require('express');
const db = require('../database/index');

const app = express();
app.use(express.json());

const port = 3300;

// db.connect();

app.get('/reviews', async (req, res) => {
  const getQuery = 'SELECT * FROM reviews LIMIT 25';
  const results = await db.query(getQuery);
  res.send(results);
});

app.listen(port, () => {
  console.log('Server is now listening at port ', port);
});
