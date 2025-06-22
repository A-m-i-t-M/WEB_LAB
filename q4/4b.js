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
    db = client.db('internship_db'); // Database
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection failed", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Internship Entry Form</h1>
    <form action="/add-intern" method="POST">
      Student ID: <input type="text" name="Student_ID" required><br><br>
      Name: <input type="text" name="Name" required><br><br>
      Company: <input type="text" name="Company" required><br><br>
      Duration: <input type="text" name="Duration" required><br><br>
      Status: <input type="text" name="Status" required><br><br>
      <button type="submit">Add Intern</button>
    </form>
    <br><a href="/infosys">Show Infosys Interns</a><br><br>
    <form action="/mark-completed" method="POST">
      Student ID (to mark completed): <input type="text" name="Student_ID" required><br><br>
      <button type="submit">Mark as Completed</button>
    </form>
  `);
});

app.post('/add-intern', async (req, res) => {
  try {
    const { Student_ID, Name, Company, Duration, Status } = req.body;
    await db.collection('internships').insertOne({
      Student_ID,
      Name,
      Company,
      Duration,
      Status
    });
    res.send("Intern added successfully!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Insertion failed: " + err.message);
  }
});

app.get('/infosys', async (req, res) => {
  try {
    const interns = await db.collection('internships').find({ Company: "Infosys" }).toArray();
    let html = `<h1>Students Interning at Infosys</h1>`;
    interns.forEach(i => {
      html += `<p>${i.Student_ID} - ${i.Name} - ${i.Duration} - ${i.Status}</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching Infosys interns");
  }
});

app.post('/mark-completed', async (req, res) => {
  try {
    const { Student_ID } = req.body;
    const result = await db.collection('internships').updateOne(
      { Student_ID: Student_ID },
      { $set: { Status: "Completed" } }
    );
    if (result.modifiedCount > 0) {
      res.send("Status updated to Completed!<br><a href='/'>Back</a>");
    } else {
      res.send("Student not found<br><a href='/'>Back</a>");
    }
  } catch (err) {
    res.status(500).send("Error updating status");
  }
});
