const express = require("express");
const app = express();
app.use(express.json());

const validateYear = (req, res, next) => {
  const year = req.body.year;
  if (typeof year !== "number" || year < 1900 || year > new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid year" });
  }
  next();
};

app.post("/books", validateYear, (req, res) => {
  res.send("Valid book added");
});

app.listen(3000);
