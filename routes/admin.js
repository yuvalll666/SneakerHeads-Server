const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const adminEditorAuth = require("../middleware/adminEditorAuth");
const { User, userRole } = require("../models/user");
const { Product } = require("../models/product");
const { Payment } = require("../models/payment");
const { ADMIN, EDITOR, NORMAL } = userRole;

/**
 * Updates a product
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Product {Object}
 */
router.put("/update-product/product_by_id", adminEditorAuth, (req, res) => {
  const productId = req.query.id;
  // Find product by _id and update it to client {Object}
  Product.findOneAndUpdate({ _id: productId }, req.body, { new: true }).exec(
    (err, product) => {
      // If error bail with status 400
      if (err) {
        return res.status(400).send({ error: err });
      }
      return res.send(product);
    }
  );
});

/**
 * Get product by _id
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Product {Object}
 */
router.get("/update-product/product_by_id", adminEditorAuth, (req, res) => {
  const productId = req.query.id;
  // Find single product by _id
  Product.findById({ _id: productId }).exec((err, product) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.send(product);
  });
});

/**
 * Restore last deleted product
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Product {Object}
 */
router.post(
  "/handle-products/undoDelete",
  adminEditorAuth,
  async (req, res) => {
    // Recreate product
    let product = await new Product(req.body);
    // Save product to DB
    product.save();
    return res.send(product);
  }
);

/**
 * Delete product from DB
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Product {Object}
 */
router.delete("/handle-products/deleteProduct", adminEditorAuth, (req, res) => {
  const productId = req.query.id;
  // Find one product and delete
  Product.findOneAndDelete({ _id: productId }).exec((err, prod) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.send(prod);
  });
});

/**
 * Get all products from DB by filter
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Products {Array.<Object>}
 */
router.get("/handle-products/getAllProducts", adminEditorAuth, (req, res) => {
  // If got filter from client set filter
  const filter = req.query.filter ? req.query.filter : null;

  // Get all Prodcuts sorted by date
  let x = Product.find({}).sort({ createdAt: 1 });
  // If "all" didn't pass add filter
  if (filter && filter !== "all") {
    x = x.find({ brand: filter });
  }
  x.exec((err, products) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.send(products);
  });
});

/**
 * Get all payments from DB
 * ADMIN authentication
 * @returns {Object} data - User Object
 */
router.get("/payments", adminAuth, (req, res) => {
  // Find all payments in DB
  Payment.find({}).exec((err, payments) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.send(payments);
  });
});

/**
 * Restore last deleted user
 * ADMIN authentication
 * @returns {Object} data - User Object
 */
router.post("/all-users/undoDelete", adminAuth, async (req, res) => {
  // Recreate user
  let user = await new User(req.body);
  // Save user object to DB
  user.save();
  return res.send(user);
});

/**
 * Delete a user from DB
 * ADMIN authentication
 * @returns {Object} data - Deleted user Object
 */
router.delete("/all-users/deleteUser", adminAuth, (req, res) => {
  const userId = req.query.id;
  // Find user by _id and delete
  User.findOneAndDelete({ _id: userId }).exec((err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.send(user);
  });
});

/**
 * Demote EDITOR user to NORMAL user
 * ADMIN authentication
 * @returns {Object} data - User Object
 */
router.post("/all-users/makeNormal", adminAuth, (req, res) => {
  const userId = req.query.id;
  // Find user by _id and update
  User.findOneAndUpdate({ _id: userId }, { role: NORMAL }, { new: true }).exec(
    (err, user) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      return res.send(user);
    }
  );
});

/**
 * Promote NORAML user TO EDITOR user
 * ADMIN authentication
 * @returns {Object} data - User Object
 */
router.post("/all-users/makeEditor", adminAuth, (req, res) => {
  const userId = req.query.id;
  // Find user by _id and update
  User.findOneAndUpdate({ _id: userId }, { role: EDITOR }, { new: true }).exec(
    (err, user) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      return res.send(user);
    }
  );
});

/**
 * Get single user
 * ADMIN authentication
 * @returns {Object} data - User Object
 */
router.get("/all-users/user_by_id", adminAuth, (req, res) => {
  const userId = req.query.id;
  // Get one user with only needed information
  User.findById({ _id: userId })
    .select(["-password", "-cart", "-history", "-__v", "-confirmed"])
    .exec((err, user) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      return res.send(user);
    });
});

/**
 * Get Users Array
 * ADMIN authentication
 * @returns {Object} data - User's {Array.<Object>}
 */
router.get("/getAllUsers", adminAuth, (req, res) => {
  // Fetch all users exept ADMIN users
  User.find({ role: { $ne: ADMIN } })
    .sort({ role: -1 })
    .exec((err, users) => {
      if (err) {
        return res.status(400).send({ success: false, err });
      }
      return res.send({ success: true, users });
    });
});

module.exports = router;
