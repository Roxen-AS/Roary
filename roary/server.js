const app = require('./server/index');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Roary server running at http://localhost:${PORT}`);
});
