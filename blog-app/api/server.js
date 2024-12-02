const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.jsx");
const Post = require("./models/Post.jsx");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
// rename the file
const fs = require("fs");

const app = express();
require("dotenv").config();

// middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json()); // parse incoming JSON requests
app.use(cookieParser());
// to get image : note __dirname means current dir
app.use("/uploads", express.static(__dirname + "/uploads"));

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

        // set cookies
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      }
    );
  } else {
    res.status(400).json("Wrong Credentials");
  }
  // res.json(passOk);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  // Check if token is present
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: "Token not provided" });
  }

  // Verify token
  jwt.verify(token, process.env.SECRET, {}, (err, info) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Invalid token" });
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("logout ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  // grap the name of the file its default adding weired names
  const { originalname, path } = req.file;
  // extracted the extension.
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  // verify the token
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
    // res.json(info);
  });
});

// update post endpoint put:
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    // extracted the extension.
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  // res.json({ test:4,  fileIs: req.file });
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    // before updating we are checking the person is upadating the post is the author or not.
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    // res.json({ isAuthor, postDoc, info });
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

//get all the post from db
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});
// get post
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

// Delete Post
// DELETE post endpoint
app.delete("/post/:id", async (req, res) => {
  const { token } = req.cookies; // Retrieve the token from cookies
  const { id } = req.params; // Post ID from URL params

  // Verify the token
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Find the post by ID
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the logged-in user is the author of the post
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ message: "You are not authorized to delete this post" });
      }

      // Delete the post
      await postDoc.deleteOne();

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});



// start server
app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
