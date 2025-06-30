const express = require('express');
const app = express();
const PORT = 3000;
const visitCount = {};
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
function visitorCounter(req, res, next) {
  if (req.url === '/favicon.ico') return next();
  const ip = req.ip;
  if (visitCount[ip]) {
    visitCount[ip]++;
  } else {
    visitCount[ip] = 1;
  }
  console.log(`Visitor from ${ip} has visited ${visitCount[ip]} times`);
  next();
}
app.use(logger);
app.use(visitorCounter);
app.get('/', (req, res) => {
  res.send(`<h1>Welcome!</h1><p>You have visited this site ${visitCount[req.ip]} times.</p><br><button onclick="location.reload()">Refresh</button>`);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});