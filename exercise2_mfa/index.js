const jwt = require("jsonwebtoken");

const mfaMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const otp = req.headers["x-otp"];

  if (!token || !otp) {
    return res.status(401).json({ message: "Token and OTP required" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");

    if (otp !== "123456") {
      return res.status(403).json({ message: "Invalid OTP" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = mfaMiddleware;
