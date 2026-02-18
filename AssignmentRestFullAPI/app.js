import express from "express";

const app = express();
app.use(express.json());

/* =========================
   In-Memory Data
========================= */

let books = [
  { id: 1, title: "Node Basics", author: "John", year: 2020 },
  { id: 2, title: "Express Guide", author: "Sarah", year: 2021 },
  { id: 3, title: "MongoDB Deep Dive", author: "John", year: 2019 },
  { id: 4, title: "JavaScript Mastery", author: "Mike", year: 2022 }
];

let authors = [
  { id: 1, name: "John", country: "USA" },
  { id: 2, name: "Sarah", country: "UK" }
];

/* =========================
   Middleware: Year Validation
========================= */

function validateYear(req, res, next) {
  const { year } = req.body;

  if (year !== undefined) {
    if (isNaN(year) || year < 1500 || year > new Date().getFullYear()) {
      return res.status(400).json({
        message: "Year must be a valid number between 1500 and current year"
      });
    }
  }

  next();
}

/* =========================
   BOOK ROUTES
========================= */

/*
Exercise 1 + 3:
GET all books with:
- filter by author
- filter by year
- pagination (?page=1&limit=2)
*/

app.get("/books", (req, res) => {
  let { author, year, page = 1, limit = 10 } = req.query;

  let filteredBooks = [...books];

  // Filtering
  if (author) {
    filteredBooks = filteredBooks.filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );
  }

  if (year) {
    filteredBooks = filteredBooks.filter(
      book => book.year === parseInt(year)
    );
  }

  // Pagination
  page = parseInt(page);
  limit = parseInt(limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  res.json({
    total: filteredBooks.length,
    page,
    limit,
    data: paginatedBooks
  });
});

/*
Exercise 5:
Search books by title
Example: /books/search?title=node
*/

app.get("/books/search", (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: "Title query is required" });
  }

  const result = books.filter(book =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );

  res.json(result);
});

/*
Create Book (with validation middleware)
*/

app.post("/books", validateYear, (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    year
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

/*
Update Book
*/

app.put("/books/:id", validateYear, (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title, author, year } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;
  if (year) book.year = year;

  res.json(book);
});

/*
Delete Book
*/

app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  books = books.filter(book => book.id !== id);

  res.json({ message: "Book deleted successfully" });
});

/* =========================
   AUTHOR CRUD (Exercise 4)
========================= */

// GET all authors
app.get("/authors", (req, res) => {
  res.json(authors);
});

// GET single author
app.get("/authors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const author = authors.find(a => a.id === id);

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.json(author);
});

// CREATE author
app.post("/authors", (req, res) => {
  const { name, country } = req.body;

  if (!name || !country) {
    return res.status(400).json({ message: "All fields required" });
  }

  const newAuthor = {
    id: authors.length + 1,
    name,
    country
  };

  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// UPDATE author
app.put("/authors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const author = authors.find(a => a.id === id);

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  const { name, country } = req.body;

  if (name) author.name = name;
  if (country) author.country = country;

  res.json(author);
});

// DELETE author
app.delete("/authors/:id", (req, res) => {
  const id = parseInt(req.params.id);

  authors = authors.filter(a => a.id !== id);

  res.json({ message: "Author deleted successfully" });
});

/* =========================
   Server
========================= */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
