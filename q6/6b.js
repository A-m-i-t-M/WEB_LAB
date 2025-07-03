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
//     db = client.db('hospitalDB');
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("Connection error", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Hospital Registration</h1>
//     <form action="/add-hospital" method="POST">
//       Hospital ID: <input type="text" name="Hospital_ID" required><br><br>
//       Name: <input type="text" name="Name" required><br><br>
//       Location: <input type="text" name="Location" required><br><br>
//       Total Beds: <input type="number" name="Total_Beds" required><br><br>
//       Occupied Beds: <input type="number" name="Occupied_Beds" required><br><br>
//       <button type="submit">Add Hospital</button>
//     </form>
//     <br><a href="/low-availability">View Hospitals With < 10 Beds</a><br><br>
//     <h2>Admit Patient</h2>
//     <form action="/admit-patient" method="POST">
//       Hospital ID: <input type="text" name="Hospital_ID" required><br><br>
//       <button type="submit">Admit Patient</button>
//     </form>
//   `);
// });

// app.post('/add-hospital', async (req, res) => {
//   const { Hospital_ID, Name, Location, Total_Beds, Occupied_Beds } = req.body;
//   try {
//     await db.collection('hospitals').insertOne({
//       Hospital_ID,
//       Name,
//       Location,
//       Total_Beds: parseInt(Total_Beds),
//       Occupied_Beds: parseInt(Occupied_Beds)
//     });
//     res.send("Hospital added successfully!<br><a href='/'>Back</a>");
//   } catch (err) {
//     res.status(500).send("Insertion failed: " + err.message);
//   }
// });

// app.get('/low-availability', async (req, res) => {
//   try {
//     const hospitals = await db.collection('hospitals').find({
//       $expr: { $lt: [{ $subtract: ["$Total_Beds", "$Occupied_Beds"] }, 10] }
//     }).toArray();

//     let html = `<h1>Hospitals With Less Than 10 Beds Available</h1>`;
//     hospitals.forEach(h => {
//       const available = h.Total_Beds - h.Occupied_Beds;
//       html += `<p>${h.Name} (${h.Hospital_ID}) - ${h.Location} - Available Beds: ${available}</p>`;
//     });
//     html += `<br><a href='/'>Back</a>`;
//     res.send(html);
//   } catch (err) {
//     res.status(500).send("Error fetching data");
//   }
// });

// app.post('/admit-patient', async (req, res) => {
//   const { Hospital_ID } = req.body;
//   try {
//     const result = await db.collection('hospitals').updateOne(
//       { Hospital_ID: Hospital_ID },
//       { $inc: { Occupied_Beds: 1 } }
//     );

//     if (result.modifiedCount > 0) {
//       res.send("Patient admitted successfully!<br><a href='/'>Back</a>");
//     } else {
//       res.send("Hospital not found.<br><a href='/'>Back</a>");
//     }
//   } catch (err) {
//     res.status(500).send("Error admitting patient");
//   }
// });







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
//     db = client.db('hospitalDB');
//     app.listen(port, () => {
//       console.log(`Server running at port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.log("Connection error", err);
//   });

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Hospital Registration</h1>

//     <h3>Add Hospital</h3>
//     <input id="Hospital_ID" placeholder="Hospital ID"><br>
//     <input id="Name" placeholder="Name"><br>
//     <input id="Location" placeholder="Location"><br>
//     <input id="Total_Beds" type="number" placeholder="Total Beds"><br>
//     <input id="Occupied_Beds" type="number" placeholder="Occupied Beds"><br>
//     <button onclick="addHospital()">Add Hospital</button>
//     <p id="addResult"></p>

//     <h3>Admit Patient</h3>
//     <input id="Admit_Hospital_ID" placeholder="Hospital ID"><br>
//     <button onclick="admitPatient()">Admit</button>
//     <p id="admitResult"></p>

//     <h3>Hospitals With < 10 Beds Available</h3>
//     <button onclick="fetchLowAvailability()">Check Low Availability</button>
//     <div id="lowHospitals"></div>

//     <script>
//       function addHospital() {
//         fetch('/api/hospitals', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             Hospital_ID: document.getElementById('Hospital_ID').value,
//             Name: document.getElementById('Name').value,
//             Location: document.getElementById('Location').value,
//             Total_Beds: parseInt(document.getElementById('Total_Beds').value),
//             Occupied_Beds: parseInt(document.getElementById('Occupied_Beds').value)
//           })
//         })
//         .then(res => res.text())
//         .then(msg => document.getElementById('addResult').innerText = msg);
//       }

//       function admitPatient() {
//         fetch('/api/hospitals/admit', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             Hospital_ID: document.getElementById('Admit_Hospital_ID').value
//           })
//         })
//         .then(res => res.text())
//         .then(msg => document.getElementById('admitResult').innerText = msg);
//       }

//       function fetchLowAvailability() {
//         fetch('/api/hospitals/low-availability')
//           .then(res => res.json())
//           .then(data => {
//             let output = "<ul>";
//             data.forEach(h => {
//               const available = h.Total_Beds - h.Occupied_Beds;
//               output += \`<li>\${h.Name} (\${h.Hospital_ID}) - \${h.Location} - Available Beds: \${available}</li>\`;
//             });
//             output += "</ul>";
//             document.getElementById('lowHospitals').innerHTML = output || "<p>No hospitals with low availability</p>";
//           });
//       }
//     </script>
//   `);
// });

// // ✅ Add a hospital
// app.post('/api/hospitals', async (req, res) => {
//   const { Hospital_ID, Name, Location, Total_Beds, Occupied_Beds } = req.body;
//   try {
//     await db.collection('hospitals').insertOne({
//       Hospital_ID,
//       Name,
//       Location,
//       Total_Beds,
//       Occupied_Beds
//     });
//     res.send("Hospital added successfully!");
//   } catch (err) {
//     res.status(500).send("Insertion failed: " + err.message);
//   }
// });

// // ✅ View hospitals with < 10 beds available
// app.get('/api/hospitals/low-availability', async (req, res) => {
//   try {
//     const hospitals = await db.collection('hospitals').find({
//       $expr: { $lt: [{ $subtract: ["$Total_Beds", "$Occupied_Beds"] }, 10] }
//     }).toArray();
//     res.json(hospitals);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });

// // ✅ Admit a patient (increase occupied beds)
// app.post('/api/hospitals/admit', async (req, res) => {
//   const { Hospital_ID } = req.body;
//   try {
//     const result = await db.collection('hospitals').updateOne(
//       { Hospital_ID },
//       { $inc: { Occupied_Beds: 1 } }
//     );

//     if (result.modifiedCount > 0) {
//       res.send("Patient admitted successfully!");
//     } else {
//       res.send("Hospital not found.");
//     }
//   } catch (err) {
//     res.status(500).send("Error admitting patient");
//   }
// });




















const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const port = 4500;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoUrl = "mongodb://127.0.0.1:27017";
let db;
MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("MongoDB connected");
    db = client.db("hospital_db");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => console.log("MongoDB connection failed", err));

app.get("/", (req, res) => {
  res.send(`
    <h1>Hospital Data</h1>

    <h3>Add Hospital</h3>
    <input id="hid" placeholder="Hospital ID">
    <input id="name" placeholder="Name">
    <input id="location" placeholder="Location">
    <input id="total" placeholder="Total Beds">
    <input id="occupied" placeholder="Occupied Beds">
    <button onclick="submit()">Submit</button>
    <p id="submitResult"></p>

    <h3>Admit Patient</h3>
    <input id="admitId" placeholder="Hospital ID">
    <button onclick="admit()">Admit</button>
    <p id="admitResult"></p>

    <h3>Hospitals with Less Than 10 Available Beds</h3>
    <button onclick="getLow()">Get Hospitals</button>
    <div id="result"></div>

    <script>
      function submit() {
        fetch('/hospitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hospital_id: document.getElementById('hid').value,
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            total_beds: parseFloat(document.getElementById('total').value),
            occupied_beds: parseFloat(document.getElementById('occupied').value)
          })
        })
        .then(res => res.text())
        .then(data => {
          document.getElementById('submitResult').innerText = data;
        });
      }

      function admit() {
        fetch('/hospitals/admit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hospital_id: document.getElementById('admitId').value
          })
        })
        .then(res => res.text())
        .then(data => {
          document.getElementById('admitResult').innerText = data;
        });
      }

      function getLow() {
        fetch('/hospitals/lowbeds')
          .then(res => res.text())
          .then(data => {
            document.getElementById('result').innerHTML = data || '<p>No such hospitals</p>';
          });
      }
    </script>
  `);
});

app.post("/hospitals", async (req, res) => {
  try {
    const { hospital_id, name, location, total_beds, occupied_beds } = req.body;
    const t = parseFloat(total_beds);
    const o = parseFloat(occupied_beds);
    await db.collection("hospitals").insertOne({
      hospital_id,
      name,
      location,
      total_beds: t,
      occupied_beds: o,
      available_beds: t - o
    });
    res.send("Hospital added successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/hospitals/lowbeds", async (req, res) => {
  try {
    const hospitals = await db.collection("hospitals").find({
      available_beds: { $lt: 10 }
    }).toArray();
    let html = "<h2>Hospitals with Less Than 10 Available Beds</h2>";
    if (hospitals.length === 0) {
      html += "<p>No such hospitals</p>";
    } else {
      hospitals.forEach(h => {
        html += `<p>${h.name} (${h.hospital_id}) - ${h.location} - Available Beds: ${h.available_beds}</p>`;
      });
    } 
    res.send(html);
    // res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/hospitals/admit", async (req, res) => {
  try {
    const { hospital_id } = req.body;
    const result = await db.collection("hospitals").updateOne(
      { hospital_id, available_beds: { $gt: 0 } },
      {
        $inc: {
          occupied_beds: 1,
          available_beds: -1
        }
      }
    );
    if (result.matchedCount === 0) {
      res.send("Hospital not found or no available beds.");
    } else {
      res.send("Patient admitted successfully.");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});