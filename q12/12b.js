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
//     db = client.db('examDB');
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("MongoDB connection error:", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Exam Management System</h1>
//     <form action="/add-student" method="POST">
//       Student ID: <input type="text" name="Student_ID" required><br><br>
//       Name: <input type="text" name="Name" required><br><br>
//       Subject: <input type="text" name="Subject" required><br><br>
//       Marks: <input type="number" name="Marks" required><br><br>
//       <button type="submit">Submit</button>
//     </form>
//     <hr>
//     <a href="/not-eligible">View Not Eligible Students</a>
//   `);
// });

// app.post('/add-student', async (req, res) => {
//   const { Student_ID, Name, Subject, Marks } = req.body;
//   try {
//     const status = parseInt(Marks) < 20 ? "Not Eligible" : "Eligible";
//     await db.collection('students').insertOne({
//       Student_ID,
//       Name,
//       Subject,
//       Marks: parseInt(Marks),
//       Eligibility_Status: status
//     });
//     res.send("Student data recorded successfully.<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Insertion error: " + err.message);
//   }
// });

// app.get('/not-eligible', async (req, res) => {
//   try {
//     const students = await db.collection('students').find({
//       Eligibility_Status: "Not Eligible"
//     }).toArray();
//     let html = `<h1>Not Eligible Students (Marks < 20)</h1>`;
//     students.forEach(s => {
//       html += `<p>${s.Name} (${s.Student_ID}) - Subject: ${s.Subject}, Marks: ${s.Marks}</p>`;
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
    db = client.db('examDBDB');
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

    <h3>Record Student Marks</h3>
    <input id="Student_ID" placeholder="Student ID"><br>
    <input id="Name" placeholder="Name"><br>
    <input id="Subject" placeholder="Subject"><br>
    <input id="Marks" type="number" placeholder="Marks"><br>
    <button onclick="submitMarks()">Submit</button>
    <p id="submitStatus"></p>

    <hr>

    <h3>Not Eligible Students (Marks < 20)</h3>
    <button onclick="loadNotEligible()">Load List</button>
    <div id="notEligibleList"></div>

    <script>
      function submitMarks() {
        fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Student_ID: document.getElementById('Student_ID').value,
            Name: document.getElementById('Name').value,
            Subject: document.getElementById('Subject').value,
            Marks: document.getElementById('Marks').value
          })
        })
        .then(res => res.text())
        .then(msg => document.getElementById('submitStatus').innerText = msg);
      }

      function loadNotEligible() {
        fetch('/api/students/not-eligible')
          .then(res => res.text())
          .then(data => {
            document.getElementById('notEligibleList').innerHTML = data || "<p>No ineligible students found</p>";
          });
      }
    </script>
  `);
});

app.post('/api/students', async (req, res) => {
  const { Student_ID, Name, Subject, Marks } = req.body;
  try {
    const numericMarks = parseInt(Marks);
    const status = numericMarks < 20 ? "Not Eligible" : "Eligible";
    await db.collection('students').insertOne({Student_ID, Name, Subject, Marks: numericMarks, Eligibility_Status: status});
    res.send("Student data recorded successfully.");
  } catch (err) {
    res.status(500).send("Insertion error: " + err.message);
  }
});

app.get('/api/students/not-eligible', async (req, res) => {
  try {
    const students = await db.collection('students').find({
      Eligibility_Status: "Not Eligible"
    }).toArray();
    let html = `<h2>Not Eligible Students (Marks < 20)</h2>`;
    if (students.length === 0) {
      html += "<p>No ineligible students found</p>";
    }
    students.forEach(s => {
      html += `<p>${s.Name} (${s.Student_ID}) - Subject: ${s.Subject}, Marks: ${s.Marks}</p>`;
    });
    res.send(html);
    // res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});
