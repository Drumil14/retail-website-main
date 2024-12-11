const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Create an Express app
const app = express();

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MySQL database
const db = mysql.createConnection({
  host: "localhost", // Database host
  user: "root", // Your MySQL username
  password: "1234", // Your MySQL password
  database: "BusinessPageDB", // The database we created earlier
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Route to fetch products
app.get("/products", (req, res) => {
  const query = "SELECT * FROM Products";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

fetch("/add-product", {
  method: "POST", // Specify POST
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    productName: "Sample Product",
    description: "This is a sample description.",
    price: 19.99,
    imageUrl: "http://example.com/image.jpg",
    category: "electronics",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error));
app.post("/add-product", (req, res) => {
  const { productName, description, price, imageUrl, category } = req.body;
  const query =
    "INSERT INTO Products (ProductName, Description, Price, ImageURL, Category) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [productName, description, price, imageUrl, category],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "Product added successfully!",
        productId: result.insertId,
      });
    }
  );
});

// Route to add a new product
app.post("/add-product", (req, res) => {
  const { productName, description, price, imageUrl, category } = req.body;
  const query = `INSERT INTO Products (ProductName, Description, Price, ImageURL, Category) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    query,
    [productName, description, price, imageUrl, category],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "Product added successfully!",
        productId: result.insertId,
      });
    }
  );
});

// Route to delete a product
app.delete("/delete-product/:id", (req, res) => {
  const productId = req.params.id;
  const query = `DELETE FROM Products WHERE ProductID = ?`;
  db.query(query, [productId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Product deleted successfully!" });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
