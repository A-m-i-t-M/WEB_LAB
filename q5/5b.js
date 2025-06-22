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
    db = client.db('student_records'); // Database
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection failed", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Student Entry Form</h1>
    <form action="/add-student" method="POST">
      Name: <input type="text" name="Name" required><br><br>
      USN: <input type="text" name="USN" required><br><br>
      Department: <input type="text" name="Department" required><br><br>
      Grade: <input type="text" name="Grade" required><br><br>
      <button type="submit">Add Student</button>
    </form>
    <br><a href="/students">View All Students</a><br><br>
    <form action="/update-grade" method="POST">
      Name (to update): <input type="text" name="Name" required><br><br>
      New Grade: <input type="text" name="Grade" required><br><br>
      <button type="submit">Update Grade</button>
    </form>
  `);
});

app.post('/add-student', async (req, res) => {
  try {
    const { Name, USN, Department, Grade } = req.body;
    await db.collection('students').insertOne({ Name, USN, Department, Grade });
    res.send("Student added successfully!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Insertion failed: " + err.message);
  }
});

app.post('/update-grade', async (req, res) => {
  try {
    const { Name, Grade } = req.body;
    const result = await db.collection('students').updateOne(
      { Name: Name },
      { $set: { Grade: Grade } }
    );
    if (result.modifiedCount > 0) {
      res.send("Grade updated successfully!<br><a href='/'>Back</a>");
    } else {
      res.send("Student not found<br><a href='/'>Back</a>");
    }
  } catch (err) {
    res.status(500).send("Error updating grade");
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await db.collection('students').find().toArray();
    let html = `<h1>All Students</h1>`;
    students.forEach(s => {
      html += `<p>${s.Name} - ${s.USN} - ${s.Department} - ${s.Grade}</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});