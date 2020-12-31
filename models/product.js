const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1024,
    },
    price: {
      type: Number,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    images: {
      type: Array,
      default: [],
      required: true,
      minlength: 11,
      maxlength: 1024,
    },
    brand: {
      type: Number,
      default: 1,
    },
    tags: {
      type: Array,
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create mongoose Product model with schema
const Product = mongoose.model("Product", productSchema);

exports.Product = Product;
