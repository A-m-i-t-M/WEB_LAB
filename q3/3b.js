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
    db = client.db('HR'); // ✅ DB name is HR
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("Can't connect to MongoDB", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Employee Entry Form</h1>
    <form action="/insert" method="POST">
      Name: <input type="text" name="emp_name" required><br><br>
      Email: <input type="email" name="email" required><br><br>
      Phone: <input type="text" name="phone" required><br><br>
      Hire Date: <input type="date" name="hire_date" required><br><br>
      Job Title: <input type="text" name="job_title" required><br><br>
      Salary: <input type="number" name="salary" required><br><br>
      <button type="submit">Add Employee</button>
    </form>
    <br>
    <a href="/high-earners">View Employees with Salary > 50000</a>
  `);
});

app.post('/insert', async (req, res) => {
  try {
    const { emp_name, email, phone, hire_date, job_title, salary } = req.body;
    await db.collection('employees').insertOne({
      emp_name,
      email,
      phone,
      hire_date,
      job_title,
      salary: parseFloat(salary)
    });
    res.send("Employee added successfully!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.get('/high-earners', async (req, res) => {
  try {
    const employees = await db.collection('employees').find({ salary: { $gt: 50000 } }).toArray();
    let html = '<h1>Employees with Salary > 50,000</h1>';
    employees.forEach(emp => {
      html += `<p>${emp.emp_name} - ₹${emp.salary} - ${emp.job_title}</p>`;
    });
    html += '<br><a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching employees");
  }
});