const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    photos: [
      {
        type: String,
        required: true,
      },
    ],
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String },
    location: { type: String },
    contactNumber: { type: Number, required: true },
    propertyArea: { type: String },
    purpose: { type: String, required: true },
  },
  { timestamps: true }
);

const Property = new mongoose.model("property", propertySchema);
module.exports = Property;
