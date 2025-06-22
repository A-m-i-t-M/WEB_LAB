const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let db;
const mongoUrl = 'mongodb://127.0.0.1:27017';
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("MongoDB connected");
    db = client.db('complaint_db');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log("Failed to connect to MongoDB");
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Complaint Management System</h1>
    <h2>Submit Complaint</h2>
    <form action="/submit" method="POST">
      User Name: <input type="text" name="username" required><br><br>
      Issue: <input type="text" name="issue" required><br><br>
      <button type="submit">Submit Complaint</button>
    </form>
    <br><br>
    <h2>Update Complaint Status</h2>
    <form action="/update" method="POST">
      Complaint ID: <input type="text" name="id" required><br><br>
      New Status: 
      <select name="status">
        <option>Pending</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select><br><br>
      <button type="submit">Update Status</button>
    </form>
    <br>
    <a href="/pending">View Pending Complaints</a>
  `);
});

app.post('/submit', async (req, res) => {
  try {
    const { username, issue } = req.body;
    await db.collection('complaints').insertOne({
      username,
      issue,
      status: 'Pending'
    });
    res.send("Complaint submitted successfully!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/update', async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await db.collection('complaints').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );
    if (result.modifiedCount > 0) {
      res.send("Complaint status updated successfully!<br><a href='/'>Back</a>");
    } else {
      res.send("Complaint not found.<br><a href='/'>Back</a>");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/pending', async (req, res) => {
  try {
    const results = await db.collection('complaints').find({ status: 'Pending' }).toArray();
    let html = '<h1>Pending Complaints</h1>';
    results.forEach(c => {
      html += `<p><b>ID:</b> ${c._id} | <b>User:</b> ${c.username} | <b>Issue:</b> ${c.issue}</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
