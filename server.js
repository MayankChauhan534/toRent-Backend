require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const User = require("./models/user");
const userRoute = require("./routes/user");
const propertyRoute = require("./routes/property");

// Middlwwares
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

const DBURL = process.env.DBURL;

mongoose
  .connect(DBURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error: " + err));

// Routes
app.use("/user", userRoute);
app.use("/property", propertyRoute);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(PORT, console.log(`Server runining at port ${PORT}`));
