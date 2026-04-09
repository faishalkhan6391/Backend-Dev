const express = require("express");
const app = express();

let books = [
  { title: "Node Basics" },
  { title: "Advanced Express" }
];

app.get("/search", (req, res) => {
  const q = req.query.q || "";
  const result = books.filter(b => b.title.toLowerCase().includes(q.toLowerCase()));
  res.json(result);
});

app.listen(3000);
