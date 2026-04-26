const express = require('express');
const router = express.Router();
const { RoaryData, liveState } = require('../data/seed');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

router.get('/kpis', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(RoaryData.analyticsKPIs);
});

router.get('/flow', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(RoaryData.chartData.crowdFlow);
});

router.get('/ingress', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(RoaryData.chartData.ingress);
});

router.get('/gates', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(liveState.gates);
});

router.get('/concessions', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(RoaryData.concessions);
});

module.exports = router;
