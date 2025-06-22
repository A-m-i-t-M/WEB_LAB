const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let db;
const mongoUrl = 'mongodb://127.0.0.1:27017';
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("MongoDB connected");
    db = client.db('startupDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("Connection error", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Student Startup Portal</h1>
    <form action="/submit" method="POST">
      ID: <input type="text" name="ID" required><br><br>
      Team Name: <input type="text" name="Team_Name" required><br><br>
      Title: <input type="text" name="Title" required><br><br>
      Domain: <input type="text" name="Domain" required><br><br>
      Funding Required (in Lakhs): <input type="number" name="Funding_Required" required><br><br>
      <button type="submit">Submit Idea</button>
    </form>
    <hr>
    <a href="/filter-edtech">View EdTech Ideas > 15 Lakhs</a>
  `);
});

app.post('/submit', async (req, res) => {
  const { ID, Team_Name, Title, Domain, Funding_Required } = req.body;
  try {
    await db.collection('startup_ideas').insertOne({
      ID,
      Team_Name,
      Title,
      Domain,
      Funding_Required: parseFloat(Funding_Required)
    });
    res.send("Startup idea submitted successfully.<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Insertion error: " + err.message);
  }
});

app.get('/filter-edtech', async (req, res) => {
  try {
    const ideas = await db.collection('startup_ideas').find({
      Domain: { $regex: /^edtech$/i }, // Case-insensitive "EdTech"
      Funding_Required: { $gt: 15 }
    }).toArray();
    let html = `<h1>EdTech Startup Ideas (Funding > 15 Lakhs)</h1>`;
    ideas.forEach(i => {
      html += `<p>${i.Title} - Team: ${i.Team_Name} | ₹${i.Funding_Required} Lakhs</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching ideas");
  }
});