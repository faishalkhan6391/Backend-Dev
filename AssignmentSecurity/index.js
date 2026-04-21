import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import sanitizeHtml from "sanitize-html";
import validator from "validator";

const app = express();
app.use(express.json());

// 🔐 Helmet (CSP for CDN, YouTube, payments)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "cdn.com"],
      scriptSrc: ["'self'", "youtube.com"],
      connectSrc: ["'self'", "api.stripe.com"]
    }
  }
}));

// 🧼 Security Middlewares
app.use(mongoSanitize());
app.use(xss());

// 🚦 Rate Limiting
app.use("/login", rateLimit({ windowMs: 15*60*1000, max: 5 }));
app.use("/api", rateLimit({ windowMs: 15*60*1000, max: 100 }));

// 🗄️ MongoDB
mongoose.connect(process.env.MONGO_URI);

// 🔐 Session (MongoStore)
app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { httpOnly: true, secure: true, maxAge: 15*60*1000 }
}));

// 👤 User Schema
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
  role: String
}));

// 🔑 Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) return res.send("Invalid Email");

  const hash = await bcrypt.hash(password, 12);
  await User.create({ email, password: hash, role: "user" });
  res.send("Registered");
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email) });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.send("Invalid");

  req.session.userId = user._id;
  res.send("Logged in");
});

// 🔒 Auth Middleware
const isAuth = (req,res,next)=>{
  if(!req.session.userId) return res.status(401).send("Unauthorized");
  next();
};

// 🔍 Secure Search (No Injection)
app.get("/products", async (req,res)=>{
  const q = String(req.query.q || "");
  const products = await mongoose.model("Product")
    .find({ name: { $regex: q, $options: "i" } });
  res.json(products);
});

// ✍️ Secure Review (XSS Safe)
app.post("/review", isAuth, async (req,res)=>{
  const clean = sanitizeHtml(req.body.text,{
    allowedTags:["b","i","a"],
    allowedAttributes:{a:["href"]}
  });
  await mongoose.model("Review").create({ text: clean });
  res.send("Review added");
});

// 📁 File Upload Check
app.post("/upload", (req,res)=>{
  const file = req.files.file;
  if(!["application/pdf","image/png","image/jpeg"].includes(file.mimetype))
    return res.send("Invalid file");
  if(file.size > 5*1024*1024) return res.send("Too large");
  res.send("Uploaded");
});

// 🔐 Authorization Example
app.get("/admin", isAuth, async (req,res)=>{
  const user = await User.findById(req.session.userId);
  if(user.role !== "admin") return res.status(403).send("Forbidden");
  res.send("Admin Panel");
});

// ❌ Safe Error Handling
app.use((err,req,res,next)=>{
  res.status(500).send("Something went wrong");
});

// 🚀 Start
app.listen(3000);