const express = require('express');
const router = express.Router();
const { RoaryData } = require('../data/seed');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

router.get('/', async (req, res) => {
  await delay(50 + Math.random() * 100);
  const { type } = req.query;
  let facilities = RoaryData.facilities;
  if (type) facilities = facilities.filter(f => f.type === type);
  res.json(facilities);
});

module.exports = router;
