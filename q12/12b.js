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
    db = client.db('examDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection error:", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Exam Management System</h1>
    <form action="/add-student" method="POST">
      Student ID: <input type="text" name="Student_ID" required><br><br>
      Name: <input type="text" name="Name" required><br><br>
      Subject: <input type="text" name="Subject" required><br><br>
      Marks: <input type="number" name="Marks" required><br><br>
      <button type="submit">Submit</button>
    </form>
    <hr>
    <a href="/not-eligible">View Not Eligible Students</a>
  `);
});

app.post('/add-student', async (req, res) => {
  const { Student_ID, Name, Subject, Marks } = req.body;
  try {
    const status = parseInt(Marks) < 20 ? "Not Eligible" : "Eligible";
    await db.collection('students').insertOne({
      Student_ID,
      Name,
      Subject,
      Marks: parseInt(Marks),
      Eligibility_Status: status
    });
    res.send("Student data recorded successfully.<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Insertion error: " + err.message);
  }
});

app.get('/not-eligible', async (req, res) => {
  try {
    const students = await db.collection('students').find({
      Eligibility_Status: "Not Eligible"
    }).toArray();
    let html = `<h1>Not Eligible Students (Marks < 20)</h1>`;
    students.forEach(s => {
      html += `<p>${s.Name} (${s.Student_ID}) - Subject: ${s.Subject}, Marks: ${s.Marks}</p>`;
    });
    html += `<br><a href="/">Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});