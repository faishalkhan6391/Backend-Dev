const express = require("express");
const app = express();
app.use(express.json());

let authors = [];

// Create
app.post("/authors", (req, res) => {
  authors.push(req.body);
  res.send("Author added");
});

// Read
app.get("/authors", (req, res) => res.json(authors));

// Update
app.put("/authors/:id", (req, res) => {
  authors[req.params.id] = req.body;
  res.send("Updated");
});

// Delete
app.delete("/authors/:id", (req, res) => {
  authors.splice(req.params.id, 1);
  res.send("Deleted");
});

app.listen(3000);
