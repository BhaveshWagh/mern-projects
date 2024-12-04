const express = require("express");
const mongoose = require("mongoose");
// Multer...
const multer = require("multer");
// const upload = multer({ dest: "./files" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

const cors = require("cors");

require("dotenv").config(); // Load environment variables

const app = express();

// middleware : parser convert into json
app.use(express.json());
app.use(cors());

// mongodb connection....
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("mongoose error :" + err));

// apis:
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
});

app.get("/", (req, res) => {
  console.log("Route API is working fine!");
  res.send("Cool! ");
});

app.listen(8000, () => {
  console.log("Server is running on PORT: 8000");
});
