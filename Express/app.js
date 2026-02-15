import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//  1. Response Time Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const end = Date.now();
    console.log(`${req.method} ${req.url} - ${end - start}ms`);
  });
  next();
});

// Dummy Users
const users = [
  { id: 1, name: "Rahul" },
  { id: 2, name: "Amit" },
  { id: 3, name: "Sneha" }
];

// Dummy Blog Data
let posts = [
  { id: 1, title: "First Post", content: "Hello World!" }
];

// Home
app.get("/", (req, res) => {
  res.render("index");
});


//  2. Query Parameter Filtering
app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name) {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(filtered);
  } else {
    res.json(users);
  }
});


//  3. Contact Form (GET)
app.get("/contact", (req, res) => {
  res.render("contact");
});

// POST Contact
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  res.send(`Thank you ${name}, we received your message!`);
});


//  4. Photo Gallery
app.get("/gallery", (req, res) => {
  const images = ["img1.jpg", "img2.jpg", "img3.jpg"];
  res.render("gallery", { images });
});


//  5. Blog Routes

// List all posts
app.get("/blog", (req, res) => {
  res.render("blog", { posts });
});

// View single post
app.get("/blog/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).render("404");
  res.render("post", { post });
});

// New post form
app.get("/newpost", (req, res) => {
  res.render("newpost");
});

// Create new post
app.post("/newpost", (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content
  };
  posts.push(newPost);
  res.redirect("/blog");
});


//  6. Custom 404 Page
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
