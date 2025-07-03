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
//     db = client.db('courseDB');
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("Connection error", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Course Enrollment Form</h1>
//     <form action="/enroll" method="POST">
//       Student ID: <input type="text" name="Student_ID" required><br><br>
//       Name: <input type="text" name="Name" required><br><br>
//       Course Name: <input type="text" name="Course_Name" required><br><br>
//       Duration: <input type="text" name="Duration" required><br><br>
//       Status: <input type="text" name="Status" required><br><br>
//       <button type="submit">Submit</button>
//     </form>
//     <hr>
//     <a href="/active-enrollments">View Active Enrollments</a><br><br>
//     <h2>Update Status to Completed</h2>
//     <form action="/update-status" method="POST">
//       Student ID (optional): <input type="text" name="Student_ID"><br><br>
//       OR<br><br>
//       Course Name (optional): <input type="text" name="Course_Name"><br><br>
//       <button type="submit">Mark as Completed</button>
//     </form>
//   `);
// });

// app.post('/enroll', async (req, res) => {
//   const { Student_ID, Name, Course_Name, Duration, Status } = req.body;
//   try {
//     await db.collection('enrollments').insertOne({
//       Student_ID,
//       Name,
//       Course_Name,
//       Duration,
//       Status
//     });
//     res.send("Enrollment successful!<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Error storing enrollment: " + err.message);
//   }
// });

// app.get('/active-enrollments', async (req, res) => {
//   try {
//     const data = await db.collection('enrollments').find({ Status: "active" }).toArray();
//     let html = `<h1>Active Enrollments</h1>`;
//     data.forEach(e => {
//       html += `<p>${e.Student_ID} - ${e.Name} - ${e.Course_Name} (${e.Duration})</p>`;
//     });
//     html += `<br><a href='/'>Back</a>`;
//     res.send(html);
//   } catch (err) {
//     res.status(500).send("Error fetching enrollments");
//   }
// });

// app.post('/update-status', async (req, res) => {
//   const { Student_ID, Course_Name } = req.body;
//   let query = {};
//   if (Student_ID) query.Student_ID = Student_ID;
//   else if (Course_Name) query.Course_Name = Course_Name;
//   else return res.send("Please provide Student_ID or Course_Name.<br><a href='/'>Back</a>");
//   try {
//     const result = await db.collection('enrollments').updateMany(
//       query,
//       { $set: { Status: "completed" } }
//     );

//     if (result.modifiedCount > 0) {
//       res.send("Status updated to completed.<br><a href='/'>Back</a>");
//     } else {
//       res.send("No matching enrollment found.<br><a href='/'>Back</a>");
//     }
//   } catch (err) {
//     res.status(500).send("Error updating status");
//   }
// });




// const express = require('express');
// const {MongoClient} = require('mongodb');
// const bodyParser = require('body-parser');
// const port = 3000;
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// const mongoUrl = "mongodb://localhost:27017";
// let db;
// MongoClient.connect(mongoUrl)
//   .then(client => {
//     console.log("MongoDB connected boss");
//     db = client.db("db3");
//     app.listen(port, ()=> console.log("server is up & running at http://localhost:"+port))
//   })
//   .catch(err => console.log("MongoDB connection failed", err));
// app.get("/", (req, res)=>{
//   res.send(`
//     <input id = "id" placeholder = "ID"/>
//     <input id = "name" placeholder = "Name"/>
//     <input id = "course" placeholder = "Course Name"/>
//     <input id = "duration" placeholder = "Duration"/>
//     <input id = "status" placeholder = "Status"/>
//     <button onClick = "submit()">Submit</button>
//     <p id = "submitResult"></p>
    
//     <input id = "uid" placeholder = "ID"/>
//     <input id = "ucourse" placeholder = "Course Name"/>
//     <input id = "ustatus" placeholder = "Status"/>
//     <button onClick = "update()">Update</button>
//     <p id = "updateResult"></p>

//     <button oncClick = "view()">View All Active Enrollments</button>
//     <div id = "viewResult"></div>

//     <script>
//       function submit(){
//         fetch('/add', {
//           method : "POST", 
//           headers : {'Content-Type' : 'application/json'},
//           body : JSON.stringify({
//             id  : document.getElementById("id").value,
//             name : document.getElementById("name").value,
//             course : document.getElementById("course").value,
//             duration : document.getElementById("duration").value,
//             status : document.getElementById("status").value
//           })
//         })
//         .then(res = >res.text())
//         .then(data => document.getElementById("submitResult").innerText = data);
//       }

//       function update(){
//         fetch(\`update/\${document.getElementById("uname")}\`, {
          
//         })
//       }
//     </script>
//   `);
// })















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
    console.log("Mongo connected boss");
    db = client.db('courseDB');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection failed", err);
  });

app.get("/", (req, res) => {
  res.send(`
    <h1>Course Enrollment Portal</h1>

    <h2>Enroll Student</h2>
    <input id="sid" placeholder="Student ID" />
    <input id="name" placeholder="Name" />
    <input id="course" placeholder="Course Name" />
    <input id="duration" placeholder="Duration" />
    <input id="status" placeholder="Status" />
    <button onclick="submit()">Enroll</button>
    <p id="submitResult"></p>

    <h2>Update Status to Completed</h2>
    <input id="updateSid" placeholder="Student ID (optional)" />
    <input id="updateCourse" placeholder="Course Name (optional)" />
    <button onclick="update()">Update</button>
    <p id="updateResult"></p>

    <h2>Active Enrollments</h2>
    <button onclick="view()">View Active</button>
    <div id="viewResult"></div>

    <script>
      function submit() {
        fetch("/add", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Student_ID: document.getElementById("sid").value,
            Name: document.getElementById("name").value,
            Course_Name: document.getElementById("course").value,
            Duration: document.getElementById("duration").value,
            Status: document.getElementById("status").value
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
            Student_ID: document.getElementById("updateSid").value,
            Course_Name: document.getElementById("updateCourse").value
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
    const { Student_ID, Name, Course_Name, Duration, Status } = req.body;
    await db.collection('enrollments').insertOne({ Student_ID, Name, Course_Name, Duration, Status });
    res.send("Enrollment successful!");
  } catch (error) {
    res.status(500).send("Error storing enrollment: " + error.message);
  }
});

app.put("/update", async (req, res) => {
  try {
    const { Student_ID, Course_Name } = req.body;
    let query = {};
    if (Student_ID) query.Student_ID = Student_ID;
    else if (Course_Name) query.Course_Name = Course_Name;
    else return res.send("Please provide Student_ID or Course_Name");
    const result = await db.collection('enrollments').updateMany(
      query,
      { $set: { Status: "completed" } }
    );
    if (result.modifiedCount > 0) {
      res.send("Status updated to completed!");
    } else {
      res.send("No matching enrollment found.");
    }
  } catch (error) {
    res.status(500).send("Error updating status: " + error.message);
  }
});

app.get("/view", async (req, res) => {
  try {
    const data = await db.collection('enrollments').find({ Status: "active" }).toArray();
    let html = `<h1>Active Enrollments</h1>`;
    data.forEach(e => {
      html += `<p>${e.Student_ID} - ${e.Name} - ${e.Course_Name} (${e.Duration})</p>`;
    });
    res.send(html || "No active enrollments");
  } catch (error) {
    res.status(500).send("Error fetching active enrollments");
  }
});
