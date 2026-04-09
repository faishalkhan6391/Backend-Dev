const express = require("express");
const session = require("express-session");

const app = express();
app.use(session({ secret: "secret", resave: false, saveUninitialized: true, cookie: { maxAge: 10000 } }));

app.get("/", (req, res) => {
  res.send("Session active");
});

app.listen(3000);
