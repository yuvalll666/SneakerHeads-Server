const Joi = require("@hapi/joi");
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

/**
 * Validate an Object structure
 * @param {Object} product - Product information
 * @returns {Object} - Containes validation details
 */
function validateProduct(product) {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(255),
    description: Joi.string().required().min(2).max(1024),
    price: Joi.number().required(),
    writer: Joi.string(),
    brand: Joi.number(),
    images: Joi.array().required(),
    tags: Joi.array(),
    views: Joi.number(),
  });

  return schema.validate(product, { abortEarly: false });
}

exports.Product = Product;
exports.validateProduct = validateProduct;
