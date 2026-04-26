const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/zones', require('./routes/zones'));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/events', require('./routes/events'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/companion', require('./routes/companion'));
app.use('/api/event', require('./routes/event'));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
