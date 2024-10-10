const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config(); // Load environment variables

const app = express();
// middleware : parser convert into json
app.use(cors());
app.use(express.json());

// db connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("mongoose error :" + err));


app.use("/api", userRoutes);

app.get("/home", (req, res) => {
  console.log("Route API is working fine!");
  res.send("Cool! ");
});
app.listen(8000, () => {
  console.log("Server is running on PORT: 8000");
});
