const express = require('express');
const router = express.Router();
const { RoaryData } = require('../data/seed');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

router.get('/', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(RoaryData.events);
});

module.exports = router;
