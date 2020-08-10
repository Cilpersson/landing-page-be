import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/landingPage";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

//Error message
const COULD_NOT_SAVE_USER = "Could not save user to DB";

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/users", async (req, res) => {
  const { page } = req.query;

  /* PAGINATION */
  //+page turns string into int, fallback for no query is page one
  const pageNbr = +page || 1;
  const perPage = 20;
  const skip = perPage * (pageNbr - 1);

  const totalUsers = await User.find();
  //Gives the total amount of pages
  const pages = Math.ceil(totalUsers.length / perPage);

  const users = await User.find().limit(perPage).skip(skip).exec();

  //Made an object that returns not only users but current amount of pages.
  res.json({ pages: pages, users: users });
});

app.post("/users", async (req, res) => {
  const { name, phoneNbr, email, zipCode, city } = req.body;

  const user = new User({
    name: name,
    phoneNbr: phoneNbr,
    email: email,
    zipCode: zipCode,
    city: city,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log("this is bad");
    res.status(400).json({ message: COULD_NOT_SAVE_USER, error: err.errors });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
