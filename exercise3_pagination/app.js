const express = require("express");
const app = express();

let books = Array.from({ length: 50 }, (_, i) => ({
  title: "Book " + i,
  author: "Author",
  year: 2020
}));

app.get("/books", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  res.json(books.slice(start, end));
});

app.listen(3000);
