const express = require("express");
const bcrypt = require("bcrypt");
const { sendIt } = require("../middleware/mailer");
const { Product } = require("../models/product");
const { Payment } = require("../models/payment");
const {
  User,
  validateLogin,
  validateUser,
  validateEditedUser,
  validatePassAndUser,
} = require("../models/user");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const jwt = require("jsonwebtoken");
const { apiUrl } = require("../config");

/**
 * Get user's history information
 * @returns {Object} data - Jhistory {Array.<Object>}
 */
router.get("/getHistory", auth, (req, res) => {
  // Find user by _id
  User.findOne({ _id: req.user._id }, (err, user) => {
    let history = user.history;
    if (err) {
      return res.status(400).send({ error: err });
    }

    return res.send({ success: true, history });
  });
});

/**
 * Create payment Object
 * @returns {Object} data - JWT token {String}
 */
router.post("/successBuy", auth, (req, res) => {
  let history = [];
  let transactionData = {};

  // const {cartDetail} - Array of cart products
  // const {paymentData} - Payment information provided by paypal
  const { cartDetail, paymentData } = req.body;

  // Add to history array each modified item
  cartDetail.forEach((item) => {
    const { title, _id, price, quantity } = item;
    history.push({
      dateOfPurchase: Date.now(),
      name: title,
      _id: _id,
      price: price,
      quantity: quantity,
      paymentId: paymentData.paymentID,
    });
  });

  // Add user Object in transactionData with user's informaiton
  const { firstName, lastName, email } = req.user;
  transactionData.user = {
    _id: req.user._id,
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  // Add paymentData Object in transactionData with payment informaiton
  transactionData.paymentData = paymentData;
  // Add product Object in transactionData with bought products informaiton
  transactionData.product = history;

  // Find user by _id and update
  User.findOneAndUpdate(
    { _id: req.user._id },
    // Add history array to user doc and make cart empty
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).send({ success: false, err });
      }

      // Create new Payment doc with transactionData Object
      const payment = new Payment(transactionData);
      // Save doc to DB
      payment.save((err, doc) => {
        if (err) {
          return res.send({ success: false, err });
        }

        res.send({ success: true, token: user.generateAuthToken() });
      });
    }
  );
});

/**
 * Remove Product from cart
 * @returns {Object} data - JWT token {String}, products {Array.<Object>}, cart {Object}
 */
router.get("/removeFromCart", auth, (req, res) => {
  // Find user by _id
  User.findOneAndUpdate(
    { _id: req.user._id },
    // Remove product by _id from cart Object in DB
    { $pull: { cart: { _id: ObjectId(req.query._id) } } },
    { new: true },
    (err, user) => {
      const { cart } = user;
      // Create array of cart products details
      let array = cart.map((item) => {
        return item;
      });

      // Find all products that match _ids from array
      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, products) => {
          if (err) {
            return res.status(400).send({ error: err });
          }
          return res.send({ cart, products, token: user.generateAuthToken() });
        });
    }
  );
});

/**
 * Add Product to cart
 * @returns {Object} data - JWT token {String}
 */
router.post("/addToCart", auth, async (req, res) => {
  const { productId } = req.body;
  // Find user by _id
  await User.findOne({ _id: req.user._id }, (err, user) => {
    let duplicate = false;
    // If cart item _id match productId get in
    user.cart.forEach((item) => {
      if (item._id == productId) {
        duplicate = true;
      }
    });

    // If item exists get in
    if (duplicate) {
      // Find user by _id and increment cart quantity by 1 if found
      User.findOneAndUpdate(
        { _id: req.user._id, "cart._id": ObjectId(productId) },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, user) => {
          if (err) {
            return res.status(400).send({ success: false, err });
          }
          res.send({ token: user.generateAuthToken() });
        }
      );
      // If product don't exists in user's cart add it
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            // Cart item structure
            cart: {
              _id: ObjectId(productId),
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, user) => {
          if (err) {
            return res.send({ success: false, err });
          }
          res.send({ token: user.generateAuthToken() });
        }
      );
    }
  });
});

/**
 * Delete user from DB
 * @returns {Object} data - Deleted user {Object}
 */
router.delete("/:id", auth, async (req, res) => {
  // Find user by _id and delete
  const user = await User.findOneAndDelete({
    _id: req.params.id,
    _id: req.user._id,
  }).select("-password");
  res.send(user);
});

/**
 * Edit user details
 * @returns {Object} data - JWT token {String}
 * @see validateEditedUser
 * @see validatePassAndUser
 */
router.patch("/:id", auth, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  // If not password passed validate client Object
  if (!oldPassword && !newPassword && !confirmPassword) {
    const { error } = validateEditedUser(req.body);
    if (error) {
      return res.status(400).send({ error: "Inputs validation error" });
    }
  }

  // If passwords passed but no match between new and old, bail
  if (oldPassword && newPassword !== confirmPassword) {
    return res.status(400).send({ error: "Passwords most be the same" });
  }
  // If passwords passed and new and old password match get in
  if (oldPassword && newPassword === confirmPassword) {
    // Validate client Object structure
    const { error } = validatePassAndUser(req.body);
    if (error) {
      return res.status(400).send({ error: "Inputs validation error" });
    }
    // Find user by user's _id and paramas id
    let user = await User.findById({ _id: req.params.id, _id: req.user._id });
    // Check if passwords are the same
    let validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }

    // Create a new password and deletes all passwords passed
    let arr = ["oldPassword", "newPassword", "confirmPassword"];
    const salt = await bcrypt.genSalt(10);
    req.body["password"] = await bcrypt.hash(newPassword, salt);
    arr.forEach((key) => delete req.body[key]);
  }

  // Find user by user's _id and params id and update
  let user = await User.findOneAndUpdate(
    { _id: req.params.id, _id: req.user._id },
    req.body,
    {
      new: true,
    }
  );
  // Save updated user to DB
  user = await user.save();
  // If Couldn't save user, bail
  if (!user) {
    return res.status(404).send("The user with the given ID was not found");
  }
  res.send({ token: user.generateAuthToken() });
});

/**
 * Sign in user
 * @returns {Object} data - JWT token {String}
 * @see validateLogin
 */
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  // If Object from client don't match schema, bail
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  // Find user by email
  let user = await User.findOne({ email: req.body.email });
  // If didn't find user, bail
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  // If password doesn't match user's password, bail
  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  // If the user is not confiremed yet, bail
  if (user && !user.confirmed) {
    return res
      .status(401)
      .send(
        "This user have not been confirmed yet via email. please go to your email inbox and click the confirmation link"
      );
  }

  return res.send({ token: user.generateAuthToken() });
});

/**
 * Sign up user and save to DB
 * @returns {Object} data - User {Object}
 * @see validateUser
 * @see sendIt
 */
router.post("/signup", async (req, res) => {
  const { error } = validateUser(req.body);
  // If Object from client don't match schema, bail
  if (error) {
    return res.status(400).send({ error: "Inputs validation problem" });
  }
  // Check if user email already exists in DB
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(409)
      .send({ error: "Email address is already rgistered" });
  }
  // Create new user
  user = new User(req.body);
  // Generate salt
  const salt = await bcrypt.genSalt(10);
  // Hash user's password with salt
  user.password = await bcrypt.hash(user.password, salt);
  // Save user to DB
  await user.save();
  res.send(_.pick(user, ["_id", "firstName", "lastName", "email"]));

  // Create JWT token with user's _id and EMAIL_SECRET
  const emailToken = jwt.sign({ _id: user._id }, process.env.EMAIL_SECRET, {
    expiresIn: "1d",
  });

  const url = `${apiUrl}/confirmation/${emailToken}`;
  sendIt(user, url);
});

module.exports = router;
