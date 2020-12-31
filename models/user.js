const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Enums for user Roel
const userRole = {
  NORMAL: 0,
  EDITOR: 1,
  ADMIN: 2,
};
const { NORMAL } = userRole;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    history: {
      type: Array,
      default: [],
    },
    role: {
      type: Number,
      required: true,
      default: NORMAL,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * Create a user token with needed user information
 * @param {Object | null} options
 * @returns {String} - User's JWT token
 */
userSchema.methods.generateAuthToken = function (options = null) {
  const token = jwt.sign(
    {
      _id: this.id,
      confirmed: this.confirmed,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      email: this.email,
      password: this.password,
      cart: this.cart,
    },
    process.env.JWT_TOKEN_KEY,
    options
  );

  return token;
};

// Create mongoose User model with schema
const User = mongoose.model("User", userSchema);

/**
 * Validate an Object structure
 * @param {Object} user - User information
 * @returns {Object} - Containes validation details
 */
function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .pattern(/^([^0-9]*)$/),
    lastName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .pattern(/^([^0-9]*)$/),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user, { abortEarly: false });
}

/**
 * Validate an Object structure
 * @param {Object} user - User information
 * @returns {Object} - Containes validation details
 */
function validateEditedUser(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .pattern(/^([^0-9]*)$/),
    lastName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .pattern(/^([^0-9]*)$/),
    email: Joi.string().required().email(),
  });
  return schema.validate(user, { abortEarly: false });
}

/**
 * Validate an Object structure
 * @param {Object} data - Changed user information
 * @returns {Object} - Containes validation details
 */
function validatePassAndUser(data) {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .pattern(/^([^0-9]*)$/),
    lastName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .pattern(/^([^0-9]*)$/),
    email: Joi.string().required().email(),
    oldPassword: Joi.string().min(6).max(1024).required(),
    newPassword: Joi.string().min(6).max(1024).required(),
    confirmPassword: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

/**
 * Validate an Object structure
 * @param {Object} data - Login input data
 * @returns {Object} - Containes validation details
 */
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(2).max(255),
  });
  return schema.validate(data);
}

module.exports = {
  User,
  validateLogin,
  validateUser,
  userRole,
  validateEditedUser,
  validatePassAndUser,
};
