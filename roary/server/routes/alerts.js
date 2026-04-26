const express = require('express');
const router = express.Router();
const { liveState } = require('../data/seed');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

router.get('/', async (req, res) => {
  await delay(50 + Math.random() * 100);
  res.json(liveState.alerts);
});

router.post('/', async (req, res) => {
  await delay(50 + Math.random() * 100);
  const { title, severity, type, location, desc } = req.body;
  const newAlert = {
    id: 'a' + Date.now(),
    title: title || 'New manual alert',
    severity: severity || 'medium',
    type: type || 'Manual',
    location: location || 'Ops Center',
    desc: desc || 'Manually created alert from ops dashboard.',
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'active',
  };
  liveState.alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

router.patch('/:id/resolve', async (req, res) => {
  await delay(50 + Math.random() * 100);
  const alert = liveState.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.status = 'resolved';
  res.json(alert);
});

module.exports = router;
