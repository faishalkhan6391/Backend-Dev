// MongoDB Library System

// 1. Add new book
db.books.insertOne({
  title: "Book Name",
  author: "Author Name",
  available: true
});

// 2. Find books by author
db.books.find({ author: "Author Name" });

// 3. Update availability
db.books.updateOne(
  { title: "Book Name" },
  { $set: { available: false } }
);

// 4. Track borrowed books
db.borrowed.insertOne({
  user: "User1",
  book: "Book Name",
  borrowedAt: new Date()
});
