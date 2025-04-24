const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' folder

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Your database paasword",
  database: "Your database",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Serve index.html when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET contacts
app.get("/api/contacts/search", (req, res) => {
  const term = `%${req.query.term}%`;
  const query = "SELECT * FROM Contacts WHERE Name LIKE ?";

  db.query(query, [term], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Search failed" });
    } else {
      res.json(results);
    }
  });
});

// ADD contact
app.post("/api/contacts", (req, res) => {
  const { name, email, phone } = req.body;
  const query =
    "INSERT INTO Contacts (Name, Email, PhoneNumber) VALUES (?, ?, ?)";
  db.query(query, [name, email, phone], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Insertion error" });
    } else {
      res.json({ message: "Contact added successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
