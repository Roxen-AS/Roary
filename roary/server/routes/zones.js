const express = require('express');
const router = express.Router();
const { RoaryData } = require('../data/seed');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

router.get('/', async (req, res) => {
  await delay(50 + Math.random() * 100);
  const { type } = req.query;
  let zones = RoaryData.zones;
  if (type) zones = zones.filter(z => z.type.toLowerCase() === type.toLowerCase());
  res.json(zones);
});

router.get('/:id', async (req, res) => {
  await delay(50 + Math.random() * 100);
  const zone = RoaryData.zones.find(z => z.id === req.params.id);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });
  res.json(zone);
});

module.exports = router;
