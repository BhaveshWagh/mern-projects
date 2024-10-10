const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const userModel = require("./userSchema");
require("dotenv").config(); // Load environment variables

const app = express();

// db connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log("mongoose error :" + err));

// middleware : parser convert into json
// app.use(express.json());

app.get("/home", (req, res) => {
  console.log("Route API is working fine!");
  res.send("Cool! ");
});

// app.post("/register", async (req, res) => {
//   console.log(req.body);

//   const { name, email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

//   const userObj = new userModel({
//     name: name,
//     email: email,
//     password: hashedPassword,
//   });
//   console.log(userObj);

//   try {
//     const userDb = await userObj.save();

//     // const userDb1 = await userModel.create({
//     //   name: name,
//     //   username: username,
//     //   password: password,
//     // });

//     return res.send({
//       status: 201,
//       data: userDb,
//     });
//     // return res.status(201).json(userDb);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

app.listen(8000, () => {
  console.log("Server is running on PORT: 8000");
});
