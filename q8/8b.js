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
    db = client.db('productDB');
    app.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });
  })
  .catch(err => {
    console.log("Connection error", err);
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Product Entry Form</h1>
    <form action="/add-product" method="POST">
      Product ID: <input type="text" name="Product_ID" required><br><br>
      Name: <input type="text" name="Name" required><br><br>
      Price: <input type="number" name="Price" required><br><br>
      Discount (%): <input type="number" name="Discount" required><br><br>
      Stock: <input type="number" name="Stock" required><br><br>
      <button type="submit">Add Product</button>
    </form>
    <hr>
    <a href="/cheap-products">View Products with Final Price < 2000</a>
  `);
});

app.post('/add-product', async (req, res) => {
  const { Product_ID, Name, Price, Discount, Stock } = req.body;
  const priceNum = parseFloat(Price);
  const discountNum = parseFloat(Discount);
  const finalPrice = priceNum - (priceNum * discountNum / 100);
  try {
    await db.collection('products').insertOne({
      Product_ID,
      Name,
      Price: priceNum,
      Discount: discountNum,
      Stock: parseInt(Stock),
      Final_Price: finalPrice
    });
    res.send("Product added successfully with Final Price.<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).send("Error inserting product: " + err.message);
  }
});

app.get('/cheap-products', async (req, res) => {
  try {
    const products = await db.collection('products').find({ Final_Price: { $lt: 2000 } }).toArray();
    let html = `<h1>Products with Final Price < 2000</h1>`;
    products.forEach(p => {
      html += `<p>${p.Product_ID} - ${p.Name} | ₹${p.Final_Price.toFixed(2)}</p>`;
    });
    html += `<br><a href='/'>Back</a>`;
    res.send(html);
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});