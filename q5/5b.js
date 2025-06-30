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
//     db = client.db('student_records'); // Database
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("MongoDB connection failed", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Student Entry Form</h1>
//     <form action="/add-student" method="POST">
//       Name: <input type="text" name="Name" required><br><br>
//       USN: <input type="text" name="USN" required><br><br>
//       Department: <input type="text" name="Department" required><br><br>
//       Grade: <input type="text" name="Grade" required><br><br>
//       <button type="submit">Add Student</button>
//     </form>
//     <br><a href="/students">View All Students</a><br><br>
//     <form action="/update-grade" method="POST">
//       Name (to update): <input type="text" name="Name" required><br><br>
//       New Grade: <input type="text" name="Grade" required><br><br>
//       <button type="submit">Update Grade</button>
//     </form>
//   `);
// });

// app.post('/add-student', async (req, res) => {
//   try {
//     const { Name, USN, Department, Grade } = req.body;
//     await db.collection('students').insertOne({ Name, USN, Department, Grade });
//     res.send("Student added successfully!<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Insertion failed: " + err.message);
//   }
// });

// app.post('/update-grade', async (req, res) => {
//   try {
//     const { Name, Grade } = req.body;
//     const result = await db.collection('students').updateOne(
//       { Name: Name },
//       { $set: { Grade: Grade } }
//     );
//     if (result.modifiedCount > 0) {
//       res.send("Grade updated successfully!<br><a href='/'>Back</a>");
//     } else {
//       res.send("Student not found<br><a href='/'>Back</a>");
//     }
//   } catch (err) {
//     res.status(500).send("Error updating grade");
//   }
// });

// app.get('/students', async (req, res) => {
//   try {
//     const students = await db.collection('students').find().toArray();
//     let html = `<h1>All Students</h1>`;
//     students.forEach(s => {
//       html += `<p>${s.Name} - ${s.USN} - ${s.Department} - ${s.Grade}</p>`;
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;
const mongoUrl = 'mongodb://localhost:27017';

MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("Mongo connected boss");
    db = client.db('Recors');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection failed", err);
  });

app.get("/", (req, res) => {
  res.send(`
    <h1>Student Records Portal</h1>

    <h2>Add Student</h2>
    <input id="name" placeholder="Name" />
    <input id="usn" placeholder="USN" />
    <input id="dept" placeholder="Department" />
    <input id="grade" placeholder="Grade" />
    <button onclick="submit()">Submit</button>
    <p id="submitResult"></p>

    <h2>Update Student Grade</h2>
    <input id="uname" placeholder="Name" />
    <input id="ugrade" placeholder="New Grade" />
    <button onclick="update()">Update</button>
    <p id="updateResult"></p>

    <h2>View All Students</h2>
    <button onclick="view()">View</button>
    <div id="viewResult"></div>

    <script>
      function submit() {
        fetch("/add", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById("name").value,
            usn: document.getElementById("usn").value,
            dept: document.getElementById("dept").value,
            grade: document.getElementById("grade").value
          })
        })
        .then(res => res.text())
        .then(data => {
          document.getElementById("submitResult").innerText = data;
        });
      }

      function update() {
        fetch("/update", {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById("uname").value,
            grade: document.getElementById("ugrade").value
          })
        })
        .then(res => res.text())
        .then(data => {
          document.getElementById("updateResult").innerText = data;
        });
      }

      function view() {
        fetch("/view")
          .then(res => res.text())
          .then(data => {
            document.getElementById("viewResult").innerHTML = data;
          });
      }
    </script>
  `);
});

app.post("/add", async (req, res) => {
  try {
    const { name, usn, dept, grade } = req.body;
    await db.collection('bacche').insertOne({ name, usn, dept, grade });
    res.send("Student added successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding student.");
  }
});

app.put("/update", async (req, res) => {
  try {
    const { name, grade } = req.body;
    const result = await db.collection('bacche').updateOne(
      { name: name },
      { $set: { grade: grade } }
    );
    if (result.modifiedCount > 0) {
      res.send("Grade updated successfully!");
    } else {
      res.send("Student not found or grade unchanged.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating grade.");
  }
});

app.get("/view", async (req, res) => {
  try {
    const students = await db.collection('bacche').find().toArray();
    let html = `<h1>All Students</h1>`;
    students.forEach(s => {
      html += `<p>${s.name} - ${s.usn} - ${s.dept} - ${s.grade}</p>`;
    });
    res.send(html || "NOBODY HERE");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving students.");
  }
});
