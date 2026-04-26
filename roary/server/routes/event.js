const express = require('express');
const router = express.Router();
const { RoaryData, liveState } = require('../data/seed');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Live attendance ticker — mutates liveState.attendance
setInterval(() => {
  if (Math.random() > 0.6) {
    liveState.attendance += Math.floor(Math.random() * 4);
  }
}, 2500);

router.get('/', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json({
    ...RoaryData.event,
    attendance: liveState.attendance,
  });
});

module.exports = router;
