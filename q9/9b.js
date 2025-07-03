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
//     db = client.db('collegeDB');
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("Connection error", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Student Registration</h1>
//     <form action="/add-student" method="POST">
//       User Name: <input type="text" name="User_Name" required><br><br>
//       Branch: <input type="text" name="Branch" required><br><br>
//       Semester: <input type="number" name="Semester" required><br><br>
//       <button type="submit">Submit</button>
//     </form>
//     <hr>
//     <a href="/filter">View CSE 6th Sem Students</a>
//   `);
// });

// app.post('/add-student', async (req, res) => {
//   const { User_Name, Branch, Semester } = req.body;
//   try {
//     await db.collection('students').insertOne({
//       User_Name,
//       Branch,
//       Semester: parseInt(Semester)
//     });
//     res.send("Student record added successfully.<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Error inserting student: " + err.message);
//   }
// });

// app.get('/filter', async (req, res) => {
//   try {
//     const students = await db.collection('students').find({
//       Branch: { $regex: /^cse$/i }, // i => case-insensitive
//       Semester: 6
//     }).toArray();
//     let html = `<h1>CSE Students - 6th Semester</h1>`;
//     students.forEach(s => {
//       html += `<p>${s.User_Name} | ${s.Branch} | Semester ${s.Semester}</p>`;
//     });
//     html += `<br><a href='/'>Back</a>`;
//     res.send(html);
//   } catch (err) {
//     res.status(500).send("Error fetching students");
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
    db = client.db('collegeDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("Connection error", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Student Registration</h1>

    <h3>Add Student</h3>
    <input id="User_Name" placeholder="User Name"><br>
    <input id="Branch" placeholder="Branch"><br>
    <input id="Semester" type="number" placeholder="Semester"><br>
    <button onclick="addStudent()">Submit</button>
    <p id="addStatus"></p>

    <h3>Filter: CSE 6th Semester Students</h3>
    <button onclick="filterStudents()">View Students</button>
    <div id="studentList"></div>

    <script>
      function addStudent() {
        fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            User_Name: document.getElementById('User_Name').value,
            Branch: document.getElementById('Branch').value,
            Semester: parseInt(document.getElementById('Semester').value)
          })
        })
        .then(res => res.text())
        .then(data => document.getElementById('addStatus').innerText = data);
      }

      function filterStudents() {
        fetch('/api/students/cse6')
          .then(res => res.text())
          .then(data => {
            document.getElementById('studentList').innerHTML = data || "<p>No matching students</p>";
          });
      }
    </script>
  `);
});

app.post('/api/students', async (req, res) => {
  const { User_Name, Branch, Semester } = req.body;
  try {
    await db.collection('students').insertOne({
      User_Name,
      Branch,
      Semester: parseInt(Semester)
    });
    res.send("Student record added successfully.");
  } catch (err) {
    res.status(500).send("Error inserting student: " + err.message);
  }
});

app.get('/api/students/cse6', async (req, res) => {
  try {
    const students = await db.collection('students').find({
      Branch: { $regex: /^cse$/i },
      Semester: 6
    }).toArray();
    let html = "<h2>CSE Students - 6th Semester</h2>";
    if (students.length === 0) {
      html += "<p>No matching students found</p>";
    }
    students.forEach(s => {
      html += `<p>${s.User_Name} | ${s.Branch} | Semester ${s.Semester}</p>`;
    });
    res.send(html);
    // res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students" });
  }
});
