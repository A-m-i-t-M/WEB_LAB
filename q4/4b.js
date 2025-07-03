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
//     db = client.db('internship_db'); // Database
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("MongoDB connection failed", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Internship Entry Form</h1>
//     <form action="/add-intern" method="POST">
//       Student ID: <input type="text" name="Student_ID" required><br><br>
//       Name: <input type="text" name="Name" required><br><br>
//       Company: <input type="text" name="Company" required><br><br>
//       Duration: <input type="text" name="Duration" required><br><br>
//       Status: <input type="text" name="Status" required><br><br>
//       <button type="submit">Add Intern</button>
//     </form>
//     <br><a href="/infosys">Show Infosys Interns</a><br><br>
//     <form action="/mark-completed" method="POST">
//       Student ID (to mark completed): <input type="text" name="Student_ID" required><br><br>
//       <button type="submit">Mark as Completed</button>
//     </form>
//   `);
// });

// app.post('/add-intern', async (req, res) => {
//   try {
//     const { Student_ID, Name, Company, Duration, Status } = req.body;
//     await db.collection('internships').insertOne({
//       Student_ID,
//       Name,
//       Company,
//       Duration,
//       Status
//     });
//     res.send("Intern added successfully!<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Insertion failed: " + err.message);
//   }
// });

// app.get('/infosys', async (req, res) => {
//   try {
//     const interns = await db.collection('internships').find({ Company: "Infosys" }).toArray();
//     let html = `<h1>Students Interning at Infosys</h1>`;
//     interns.forEach(i => {
//       html += `<p>${i.Student_ID} - ${i.Name} - ${i.Duration} - ${i.Status}</p>`;
//     });
//     html += `<br><a href='/'>Back</a>`;
//     res.send(html);
//   } catch (err) {
//     res.status(500).send("Error fetching Infosys interns");
//   }
// });

// app.post('/mark-completed', async (req, res) => {
//   try {
//     const { Student_ID } = req.body;
//     const result = await db.collection('internships').updateOne(
//       { Student_ID: Student_ID },
//       { $set: { Status: "Completed" } }
//     );
//     if (result.modifiedCount > 0) {
//       res.send("Status updated to Completed!<br><a href='/'>Back</a>");
//     } else {
//       res.send("Student not found<br><a href='/'>Back</a>");
//     }
//   } catch (err) {
//     res.status(500).send("Error updating status");
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
    db = client.db('db2');
    app.listen(port, () => {
      console.log(`server up & running at http://localhost:${port}`);
    });
  })
  .catch(err => console.log("MongoDB connection failed", err));

app.get("/", (req, res) => {
  res.send(`
    <h1>Internship Portal</h1>

    <h2>Add Internship</h2>
    <input id="name" placeholder="Name"/>
    <input id="company" placeholder="Company"/>
    <input id="duration" placeholder="Duration"/>
    <input id="status" placeholder="Status"/>
    <button onclick="submit()">Submit</button>
    <p id="submitResult"></p>

    <h2>Update Internship Status</h2>
    <input id="uname" placeholder="Name"/>
    <input id="ustatus" placeholder="New Status"/>
    <button onclick="update()">Update</button>
    <p id="updateResult"></p>

    <h2>Get Infosys Interns</h2>
    <button onclick="getInfosys()">Get Infosys Interns</button>
    <div id="infosysResult"></div>

    <script>
      function submit() {
        fetch('/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            duration: document.getElementById('duration').value,
            status: document.getElementById('status').value,
          })
        })
        .then(res => res.text())
        .then(data => {
          document.getElementById('submitResult').innerText = data;
        });
      }

      function update() {
        fetch('/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: document.getElementById('uname').value,
            status: document.getElementById('ustatus').value
          })
        })
        .then(res => res.text())
        .then(data => {
          document.getElementById('updateResult').innerText = data;
        });
      }

      function getInfosys() {
        fetch('/infosys')
          .then(res => res.text())
          .then(data => {
            document.getElementById('infosysResult').innerHTML = data;
          });
      }
    </script>
  `);
});

app.post('/add', async (req, res) => {
  try {
    const { name, company, duration, status } = req.body;
    await db.collection('internships').insertOne({ name, company, duration, status });
    res.send("Internship added successfully!");
  } catch (err) {
    res.status(500).send("Error adding internship: " + err.message);
  }
});

app.put('/update', async (req, res) => {
  try {
    const { name, status } = req.body;
    const result = await db.collection('internships').updateOne(
      { name: name },
      { $set: { status: status } }
    );
    if (result.modifiedCount > 0) {
      res.send("Status updated successfully!");
    } else {
      res.send("Internship not found or status unchanged.");
    }
  } catch (err) {
    res.status(500).send("Error updating status: " + err.message);
  }
});

app.get('/infosys', async (req, res) => {
  try {
    const interns = await db.collection('internships').find({ company: "Infosys" }).toArray();
    let html = `<h1>Interns at Infosys</h1>`;
    interns.forEach(i => {
      html += `<p>${i.name} - ${i.duration} - ${i.status}</p>`;
    });
    res.send(html || "<p>No interns found at Infosys</p>");
  } catch (err) {
    res.status(500).send("Error fetching Infosys interns: " + err.message);
  }
});
