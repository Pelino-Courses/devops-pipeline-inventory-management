const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const router = require("./routes");

const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(router);

module.exports = app;
