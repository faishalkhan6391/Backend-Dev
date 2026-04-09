const express = require("express");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

app.post("/login", (req, res) => {
  req.session.user = { role: req.body.role };
  res.send("Logged in");
});

const isAdmin = (req, res, next) => {
  if (req.session.user?.role === "admin") return next();
  res.status(403).send("Forbidden");
};

app.get("/admin", isAdmin, (req, res) => {
  res.send("Welcome Admin");
});

app.listen(3000);
