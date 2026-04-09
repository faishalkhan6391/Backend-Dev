const fs = require("fs");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const log = `${new Date().toISOString()} | ${req.method} ${req.url} | ${
      res.statusCode
    } | ${Date.now() - start}ms\n`;

    fs.appendFile("requests.log", log, (err) => {
      if (err) console.error("Logging error:", err);
    });
  });

  next();
};

module.exports = requestLogger;
