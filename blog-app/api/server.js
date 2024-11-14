const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.jsx");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
require("dotenv").config();

// middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
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

  // create user and handle error
  // const userDoc = await User.create({username, password})
  // res.json(userDoc)

  //hashing the password
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
  try {
    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }

  console.log({ username, password });
  // res.json({ requestedData: { username, password } });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // for comparing password we have to first find the user from db and then compare the password
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged In
    jwt.sign(
      { username, id: userDoc._id },
      process.env.SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        // res.json(token);
        // set cookies
        res.cookie("token", token).json("ok");
      }
    );
  } else {
    res.status(400).json("Wrong Credentials");
  }
  // res.json(passOk);
});

// start server
app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
