const express = require('express');
const app = express();

const PORT = 3000;

// Route: Home
app.get('/', (req, res) => {
  res.send(`
    <h1>XYZ Engineering College</h1>
    <p>
      <a href="/cse">CSE</a> | 
      <a href="/ece">ECE</a> | 
      <a href="/mech">MECH</a>
    </p>
  `);
});

// Route: CSE
app.get('/cse', (req, res) => {
  res.send(`
    <body style="background-color:#e0f7fa; color:#006064; font-family:Arial">
      <h1>CSE - Computer Science and Engineering</h1>
      <p>Focus: Software, AI, ML, Cybersecurity</p>
    </body>
  `);
});

// Route: ECE
app.get('/ece', (req, res) => {
  res.send(`
    <body style="background-color:#fff3e0; color:#e65100; font-family:Georgia">
      <h1>ECE - Electronics and Communication Engineering</h1>
      <p>Focus: Communication Systems, VLSI, Embedded</p>
    </body>
  `);
});

// Route: MECH
app.get('/mech', (req, res) => {
  res.send(`
    <body style="background-color:#ede7f6; color:#4a148c; font-family:'Courier New'">
      <h1>MECH - Mechanical Engineering</h1>
      <p>Focus: Thermodynamics, CAD, Manufacturing</p>
    </body>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
