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
    db = client.db('courseDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("Connection error", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Course Enrollment Form</h1>
    <form action="/enroll" method="POST">
      Student ID: <input type="text" name="Student_ID" required><br><br>
      Name: <input type="text" name="Name" required><br><br>
      Course Name: <input type="text" name="Course_Name" required><br><br>
      Duration: <input type="text" name="Duration" required><br><br>
      Status: <input type="text" name="Status" required><br><br>
      <button type="submit">Submit</button>
    </form>
    <hr>
    <a href="/active-enrollments">View Active Enrollments</a><br><br>
    <h2>Update Status to Completed</h2>
    <form action="/update-status" method="POST">
      Student ID (optional): <input type="text" name="Student_ID"><br><br>
      OR<br><br>
      Course Name (optional): <input type="text" name="Course_Name"><br><br>
      <button type="submit">Mark as Completed</button>
    </form>
  `);
});

app.post('/enroll', async (req, res) => {
  const { Student_ID, Name, Course_Name, Duration, Status } = req.body;
  try {
    await db.collection('enrollments').insertOne({
      Student_ID,
      Name,
      Course_Name,
      Duration,
      Status
    });
    res.send("Enrollment successful!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Error storing enrollment: " + err.message);
  }
});

app.get('/active-enrollments', async (req, res) => {
  try {
    const data = await db.collection('enrollments').find({ Status: "active" }).toArray();
    let html = `<h1>Active Enrollments</h1>`;
    data.forEach(e => {
      html += `<p>${e.Student_ID} - ${e.Name} - ${e.Course_Name} (${e.Duration})</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching enrollments");
  }
});

app.post('/update-status', async (req, res) => {
  const { Student_ID, Course_Name } = req.body;
  let query = {};
  if (Student_ID) query.Student_ID = Student_ID;
  else if (Course_Name) query.Course_Name = Course_Name;
  else return res.send("Please provide Student_ID or Course_Name.<br><a href='/'>Back</a>");
  try {
    const result = await db.collection('enrollments').updateMany(
      query,
      { $set: { Status: "completed" } }
    );

    if (result.modifiedCount > 0) {
      res.send("Status updated to completed.<br><a href='/'>Back</a>");
    } else {
      res.send("No matching enrollment found.<br><a href='/'>Back</a>");
    }
  } catch (err) {
    res.status(500).send("Error updating status");
  }
});