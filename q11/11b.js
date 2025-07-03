// const express = require('express');
// const { MongoClient } = require('mongodb');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 3000;
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// let db;
// const mongoUrl = 'mongodb://127.0.0.1:27017';
// MongoClient.connect(mongoUrl)
//   .then(client => {
//     console.log("MongoDB connected");
//     db = client.db('attendanceDB');
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("MongoDB connection error:", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Attendance Management System</h1>
//     <form action="/add-student" method="POST">
//       Student ID: <input type="text" name="Student_ID" required><br><br>
//       Name: <input type="text" name="Name" required><br><br>
//       Course: <input type="text" name="Course" required><br><br>
//       Total Attendance Classes: <input type="number" name="Total_Attendance" required><br><br>
//       Classes Attended: <input type="number" name="Classes_Attended" required><br><br>
//       <button type="submit">Submit Attendance</button>
//     </form>
//     <hr>
//     <a href="/low-attendance">View Students with Attendance < 75%</a>
//   `);
// });

// app.post('/add-student', async (req, res) => {
//   const { Student_ID, Name, Course, Total_Attendance, Classes_Attended } = req.body;
//   try {
//     const attendancePercent = (parseInt(Classes_Attended) / parseInt(Total_Attendance)) * 100;
//     await db.collection('students').insertOne({
//       Student_ID,
//       Name,
//       Course,
//       Total_Attendance: parseInt(Total_Attendance),
//       Classes_Attended: parseInt(Classes_Attended),
//       Attendance_Percentage: attendancePercent
//     });
//     res.send("Attendance recorded successfully.<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Insertion error: " + err.message);
//   }
// });

// app.get('/low-attendance', async (req, res) => {
//   try {
//     const students = await db.collection('students').find({
//       Attendance_Percentage: { $lt: 75 }
//     }).toArray();
//     let html = `<h1>Students with Attendance < 75%</h1>`;
//     students.forEach(s => {
//       html += `<p>${s.Name} (${s.Student_ID}) - ${s.Attendance_Percentage.toFixed(2)}%</p>`;
//     });
//     html += `<br><a href="/">Back</a>`;
//     res.send(html);
//   } catch (err) {
//     res.status(500).send("Error fetching data");
//   }
// });









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
    
    <h3>Record Attendance</h3>
    <input id="Student_ID" placeholder="Student ID"><br>
    <input id="Name" placeholder="Name"><br>
    <input id="Course" placeholder="Course"><br>
    <input id="Total_Attendance" type="number" placeholder="Total Classes"><br>
    <input id="Classes_Attended" type="number" placeholder="Classes Attended"><br>
    <button onclick="submitAttendance()">Submit Attendance</button>
    <p id="submitStatus"></p>

    <hr>

    <h3>Low Attendance Report</h3>
    <button onclick="loadLowAttendance()">View Students with Attendance < 75%</button>
    <div id="lowList"></div>

    <script>
      function submitAttendance() {
        fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Student_ID: document.getElementById('Student_ID').value,
            Name: document.getElementById('Name').value,
            Course: document.getElementById('Course').value,
            Total_Attendance: document.getElementById('Total_Attendance').value,
            Classes_Attended: document.getElementById('Classes_Attended').value
          })
        })
        .then(res => res.text())
        .then(data => document.getElementById('submitStatus').innerText = data);
      }

      function loadLowAttendance() {
        fetch('/api/attendance/low')
          .then(res => res.text())
          .then(data => {
            document.getElementById('lowList').innerHTML = data || "<p>No students found</p>";
          });
      }
    </script>
  `);
});

app.post('/api/attendance', async (req, res) => {
  const { Student_ID, Name, Course, Total_Attendance, Classes_Attended } = req.body;
  try {
    const total = parseInt(Total_Attendance);
    const attended = parseInt(Classes_Attended);
    const attendancePercent = (attended / total) * 100;
    await db.collection('students').insertOne({
      Student_ID, Name, Course, Total_Attendance: total, Classes_Attended: attended, Attendance_Percentage: attendancePercent});
    res.send("Attendance recorded successfully.");
  } catch (err) {
    res.status(500).send("Insertion error: " + err.message);
  }
});

app.get('/api/attendance/low', async (req, res) => {
  try {
    const students = await db.collection('students').find({
      Attendance_Percentage: { $lt: 75 }
    }).toArray();
    let html = "<h2>Students with Attendance < 75%</h2>";
    if (students.length === 0) {
      html += "<p>No students found</p>";
    } else {
      students.forEach(s => {
        html += `<p>${s.Name} (${s.Student_ID}) - ${s.Attendance_Percentage.toFixed(2)}%</p>`;
      });
    }
    res.send(html);
    // res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});
