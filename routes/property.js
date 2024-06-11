const express = require("express");
const multer = require("multer");
const Property = require("../models/property");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      console.log("Only jpeg and png files are supported");
      callback(null, false);
    }
  },
});

// /property/upload
router.post(
  "/upload",
  fetchuser,
  upload.array("photos", 4),
  async (req, res) => {
    const filePaths = req.files.map((file) => ({ path: file.path }));
    const pathArray = new Array();
    for (let i in filePaths) {
      pathArray[i] = filePaths[i].path;
    }

    const body = req.body;

    const property = await Property.create({
      user: req.user.id,
      photos: pathArray,
      price: parseInt(body.price),
      address: body.address,
      city: body.city,
      location: body.location,
      contactNumber: parseInt(body.contactNumber),
      propertyArea: body.propertyArea,
      purpose: body.purpose,
    });

    res.status(201).json({ message: "Property added successfully" });
  }
);

// /property/query?city=City_Name&purpose=PG
router.get("/query", fetchuser, async function (req, res) {
  let properties = {};
  const { city, purpose, id } = req.query;
  if (purpose && city) {
    properties = await Property.find({
      purpose: purpose,
      city: city,
    });
  } else if (city) {
    properties = await Property.find({ city: city });
  } else if (purpose) {
    properties = await Property.find({ purpose: purpose });
  } else if (id && id === req.user.id) {
    properties = await Property.find({ user: req.user.id });
  }
  return res.send(properties);
});

module.exports = router;
