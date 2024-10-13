const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.jsx");
const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json()); // parse incoming JSON requests

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("mongoose error: " + err));

// POST route
app.post("/register", async (req, res) => {
  // grasp the name, username, & password from request body
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({ username, password });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
  //   res.json({ requestedData: { name, username, password } });
});

// start server
app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
