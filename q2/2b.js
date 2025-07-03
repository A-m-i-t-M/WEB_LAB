// const express = require('express');
// const { MongoClient } = require('mongodb');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 3000;
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// let db;
// const mongoUrl = 'mongodb://127.0.0.1:27017';
// MongoClient.connect(mongoUrl)
//   .then(client => {
//     console.log("MongoDB connected");
//     db = client.db('exam_db');
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("Failed to connect to MongoDB");
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Student Exam Fee Management</h1>
//     <h2>Add Student</h2>
//     <form action="/add" method="POST">
//       Student Name: <input type="text" name="name" required><br><br>
//       USN: <input type="text" name="usn" required><br><br>
//       Semester: <input type="number" name="semester" required><br><br>
//       Exam Fee: <input type="number" name="exam_fee"><br><br>
//       <button type="submit">Add Student</button>
//     </form>
//     <h2>Delete Students Who Have Not Paid Exam Fee</h2>
//     <form action="/delete" method="POST">
//       <button type="submit">Delete Unpaid Students</button>
//     </form>
//     <br><a href="/view">View All Students</a>
//   `);
// });

// app.post('/add', async (req, res) => {
//   try {
//     const { name, usn, semester, exam_fee } = req.body;
//     await db.collection('students').insertOne({
//       name,
//       usn,
//       semester: parseInt(semester),
//       exam_fee: exam_fee ? parseFloat(exam_fee) : null
//     });
//     res.send("Student added successfully!<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/view', async (req, res) => {
//   try {
//     const results = await db.collection('students').find({}).toArray();
//     let html = '<h1>All Students</h1>';
//     results.forEach(student => {
//       html += `<p><b>${student.name}</b> - USN: ${student.usn}, Semester: ${student.semester}, Exam Fee: ${student.exam_fee}</p>`;
//     });
//     html += `<br><a href="/">Back</a>`;
//     res.send(html);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/delete', async (req, res) => {
//   try {
//     const result = await db.collection('students').deleteMany({
//       $or: [
//         { exam_fee: { $eq: 0 } },
//         { exam_fee: { $eq: null } }
//       ]
//     });
//     res.send(`Deleted ${result.deletedCount} students who haven't paid.<br><a href="/">Back</a>`);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

















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
    console.log("Failed to connect to MongoDB", err);
  });
app.get('/', (req, res) => {
  res.send(`
    <h1>Student Exam Fee Management</h1>

    <h3>Add Student</h3>
    <input id="name" placeholder="Student Name" required><br>
    <input id="usn" placeholder="USN" required><br>
    <input id="semester" type="number" placeholder="Semester" required><br>
    <input id="exam_fee" type="number" placeholder="Exam Fee"><br>
    <button onclick="addStudent()">Add Student</button>
    <p id="addResult"></p>

    <h3>Delete Unpaid Students</h3>
    <button onclick="deleteUnpaid()">Delete Unpaid Students</button>
    <p id="deleteResult"></p>

    <h3>View All Students</h3>
    <button onclick="viewStudents()">View Students</button>
    <div id="studentList"></div>

    <script>
      function addStudent() {
        fetch('/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('name').value,
            usn: document.getElementById('usn').value,
            semester: parseInt(document.getElementById('semester').value),
            exam_fee: parseFloat(document.getElementById('exam_fee').value) || null
          })
        })
        .then(res => res.text())
        .then(data => document.getElementById('addResult').innerText = data);
      }

      function deleteUnpaid() {
        fetch('/students/unpaid', {
          method: 'DELETE'
        })
        .then(res => res.text())
        .then(data => document.getElementById('deleteResult').innerHTML = data);
      }

      function viewStudents() {
        fetch('/students')
          .then(res => res.text())
          .then(data => {
            document.getElementById('studentList').innerHTML = data || "<p>No students found</p>";
          });
      }
    </script>
  `);
});

// POST /students (Add student)
app.post('/students', async (req, res) => {
  try {
    const { name, usn, semester, exam_fee } = req.body;
    await db.collection('students').insertOne({name, usn, semester, exam_fee: exam_fee || null});
    res.send("Student added successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await db.collection('students').find({}).toArray();
    let html = '<h1>All Students</h1>';
    students.forEach(student => {
      html += `<p><b>${student.name}</b> - USN: ${student.usn}, Semester: ${student.semester}, Exam Fee: ${student.exam_fee}</p>`;
    });
    html += `<br><a href="/">Back</a>`;
    res.status(200).send(html);
    // res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/unpaid', async (req, res) => {
  try {
    const result = await db.collection('students').deleteMany({
      $or: [
        { exam_fee: { $eq: 0 } },
        { exam_fee: { $eq: null } }
      ]
    });
    res.send(`Deleted ${result.deletedCount} students who haven't paid.`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
