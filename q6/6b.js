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
    db = client.db('hospitalDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("Connection error", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Hospital Registration</h1>
    <form action="/add-hospital" method="POST">
      Hospital ID: <input type="text" name="Hospital_ID" required><br><br>
      Name: <input type="text" name="Name" required><br><br>
      Location: <input type="text" name="Location" required><br><br>
      Total Beds: <input type="number" name="Total_Beds" required><br><br>
      Occupied Beds: <input type="number" name="Occupied_Beds" required><br><br>
      <button type="submit">Add Hospital</button>
    </form>
    <br><a href="/low-availability">View Hospitals With < 10 Beds</a><br><br>
    <h2>Admit Patient</h2>
    <form action="/admit-patient" method="POST">
      Hospital ID: <input type="text" name="Hospital_ID" required><br><br>
      <button type="submit">Admit Patient</button>
    </form>
  `);
});

app.post('/add-hospital', async (req, res) => {
  const { Hospital_ID, Name, Location, Total_Beds, Occupied_Beds } = req.body;
  try {
    await db.collection('hospitals').insertOne({
      Hospital_ID,
      Name,
      Location,
      Total_Beds: parseInt(Total_Beds),
      Occupied_Beds: parseInt(Occupied_Beds)
    });
    res.send("Hospital added successfully!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Insertion failed: " + err.message);
  }
});

app.get('/low-availability', async (req, res) => {
  try {
    const hospitals = await db.collection('hospitals').find({
      $expr: { $lt: [{ $subtract: ["$Total_Beds", "$Occupied_Beds"] }, 10] }
    }).toArray();

    let html = `<h1>Hospitals With Less Than 10 Beds Available</h1>`;
    hospitals.forEach(h => {
      const available = h.Total_Beds - h.Occupied_Beds;
      html += `<p>${h.Name} (${h.Hospital_ID}) - ${h.Location} - Available Beds: ${available}</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});

app.post('/admit-patient', async (req, res) => {
  const { Hospital_ID } = req.body;
  try {
    const result = await db.collection('hospitals').updateOne(
      { Hospital_ID: Hospital_ID },
      { $inc: { Occupied_Beds: 1 } }
    );

    if (result.modifiedCount > 0) {
      res.send("Patient admitted successfully!<br><a href='/'>Back</a>");
    } else {
      res.send("Hospital not found.<br><a href='/'>Back</a>");
    }
  } catch (err) {
    res.status(500).send("Error admitting patient");
  }
});