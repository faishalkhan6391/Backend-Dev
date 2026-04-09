const express = require("express");
const app = express();

let books = [
  { title: "Book A", author: "John", year: 2020 },
  { title: "Book B", author: "Jane", year: 2021 }
];

// Filter by author or year
app.get("/books", (req, res) => {
  let result = books;
  if (req.query.author) {
    result = result.filter(b => b.author === req.query.author);
  }
  if (req.query.year) {
    result = result.filter(b => b.year == req.query.year);
  }
  res.json(result);
});

app.listen(3000);
