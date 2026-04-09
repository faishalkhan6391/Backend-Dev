const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

app.post("/add", (req, res) => {
  if (req.session.user) {
    req.session.cart = req.session.cart || [];
    req.session.cart.push(req.body.item);
  } else {
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    cart.push(req.body.item);
    res.cookie("cart", JSON.stringify(cart));
  }
  res.send("Item added");
});

app.post("/login", (req, res) => {
  req.session.user = { id: 1 };
  const cookieCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  req.session.cart = [...(req.session.cart || []), ...cookieCart];
  res.clearCookie("cart");
  res.send("Logged in and cart merged");
});

app.listen(3000);
