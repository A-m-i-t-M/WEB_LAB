const express = require('express');
const { MongoClient } = require('mongodb');
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
    db = client.db('exam_db');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.log("Failed to connect to MongoDB");
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Student Exam Fee Management</h1>
    <h2>Add Student</h2>
    <form action="/add" method="POST">
      Student Name: <input type="text" name="name" required><br><br>
      USN: <input type="text" name="usn" required><br><br>
      Semester: <input type="number" name="semester" required><br><br>
      Exam Fee: <input type="number" name="exam_fee"><br><br>
      <button type="submit">Add Student</button>
    </form>
    <h2>Delete Students Who Have Not Paid Exam Fee</h2>
    <form action="/delete" method="POST">
      <button type="submit">Delete Unpaid Students</button>
    </form>
    <br><a href="/view">View All Students</a>
  `);
});

app.post('/add', async (req, res) => {
  try {
    const { name, usn, semester, exam_fee } = req.body;
    await db.collection('students').insertOne({
      name,
      usn,
      semester: parseInt(semester),
      exam_fee: exam_fee ? parseFloat(exam_fee) : null
    });
    res.send("Student added successfully!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/view', async (req, res) => {
  try {
    const results = await db.collection('students').find({}).toArray();
    let html = '<h1>All Students</h1>';
    results.forEach(student => {
      html += `<p><b>${student.name}</b> - USN: ${student.usn}, Semester: ${student.semester}, Exam Fee: ${student.exam_fee}</p>`;
    });
    html += `<br><a href="/">Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/delete', async (req, res) => {
  try {
    const result = await db.collection('students').deleteMany({
      $or: [
        { exam_fee: { $eq: 0 } },
        { exam_fee: { $eq: null } }
      ]
    });
    res.send(`Deleted ${result.deletedCount} students who haven't paid.<br><a href="/">Back</a>`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});