const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = 'mongodb://127.0.0.1:27017';
let db;

MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("MongoDB connected");
    db = client.db('complaint_db');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log("Failed to connect to MongoDB", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Complaint Management</h1>

    <h3>Submit Complaint</h3>
    <input id="cid" placeholder="Complaint ID">
    <input id="uname" placeholder="User Name">
    <input id="issue" placeholder="Issue">
    <input id="status" placeholder="Status (Optional)">
    <button onclick="submit()">Submit</button>
    <p id="submitResult"></p>

    <h3>Update Complaint</h3>
    <input id="upid" placeholder="Complaint ID">
    <input id="upstatus" placeholder="New Status">
    <button onclick="update()">Update</button>
    <p id="updateResult"></p>

    <h3>View Pending Complaints</h3>
    <button onclick="getPending()">Get Pending</button>
    <div id="pendingResult"></div>

    <script>
      function submit() {
        fetch('/complaints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complaint_id: document.getElementById('cid').value,
            user_name: document.getElementById('uname').value,
            issue: document.getElementById('issue').value,
            status: document.getElementById('status').value || "Pending"
          })
        })
        .then(res => res.text())
        .then(data => document.getElementById('submitResult').innerText = data);
      }

      function update() {
        fetch('/complaints', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complaint_id: document.getElementById('upid').value,
            status: document.getElementById('upstatus').value
          })
        })
        .then(res => res.text())
        .then(data => document.getElementById('updateResult').innerText = data);
      }

      function getPending() {
        fetch('/complaints/pending')
          .then(res => res.json())
          .then(data => {
            let output = '';
            data.forEach(c => {
              output += \`<p>ID: \${c.complaint_id}, User: \${c.user_name}, Issue: \${c.issue}, Status: \${c.status}</p>\`;
            });
            document.getElementById('pendingResult').innerHTML = output || '<p>No pending complaints</p>';
          });
      }
    </script>
  `);
});

app.post('/complaints', async (req, res) => {
  try {
    const { complaint_id, user_name, issue, status } = req.body;
    await db.collection('complaints').insertOne({
      complaint_id,
      user_name,
      issue,
      status: status || "Pending"
    });
    res.send("Complaint submitted successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/complaints', async (req, res) => {
  try {
    const { complaint_id, status } = req.body;
    const result = await db.collection('complaints').updateOne(
      { complaint_id: complaint_id },
      { $set: { status: status } }
    );
    if (result.matchedCount === 0) {
      res.send(`Complaint with ID ${complaint_id} not found.`);
    } else {
      res.send(`Complaint ${complaint_id} status updated to ${status}.`);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/complaints/pending', async (req, res) => {
  try {
    const complaints = await db.collection('complaints').find({ status: "Pending" }).toArray();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
