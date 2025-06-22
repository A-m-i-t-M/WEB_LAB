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
    db = client.db('attendanceDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection error:", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Attendance Management System</h1>
    <form action="/add-student" method="POST">
      Student ID: <input type="text" name="Student_ID" required><br><br>
      Name: <input type="text" name="Name" required><br><br>
      Course: <input type="text" name="Course" required><br><br>
      Total Attendance Classes: <input type="number" name="Total_Attendance" required><br><br>
      Classes Attended: <input type="number" name="Classes_Attended" required><br><br>
      <button type="submit">Submit Attendance</button>
    </form>
    <hr>
    <a href="/low-attendance">View Students with Attendance < 75%</a>
  `);
});

app.post('/add-student', async (req, res) => {
  const { Student_ID, Name, Course, Total_Attendance, Classes_Attended } = req.body;
  try {
    const attendancePercent = (parseInt(Classes_Attended) / parseInt(Total_Attendance)) * 100;
    await db.collection('students').insertOne({
      Student_ID,
      Name,
      Course,
      Total_Attendance: parseInt(Total_Attendance),
      Classes_Attended: parseInt(Classes_Attended),
      Attendance_Percentage: attendancePercent
    });
    res.send("Attendance recorded successfully.<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Insertion error: " + err.message);
  }
});

app.get('/low-attendance', async (req, res) => {
  try {
    const students = await db.collection('students').find({
      Attendance_Percentage: { $lt: 75 }
    }).toArray();
    let html = `<h1>Students with Attendance < 75%</h1>`;
    students.forEach(s => {
      html += `<p>${s.Name} (${s.Student_ID}) - ${s.Attendance_Percentage.toFixed(2)}%</p>`;
    });
    html += `<br><a href="/">Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});