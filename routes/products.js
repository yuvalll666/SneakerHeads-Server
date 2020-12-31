const express = require("express");
const router = express.Router();
const multer = require("multer");
const authEditorAuth = require("../middleware/adminEditorAuth")
const path = require("path");
const { Product, validateProduct } = require("../models/product");

/**
 * Get most viewed products
 * @returns {Object} data - Products {Array.<Object>}
 */
router.post("/getMostViews", (req, res) => {
  let limit = req.body.limit;
  // Find most viewed product with limit
  Product.find({})
    .sort({ views: -1 })
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).send({ success: false, error });
      }
      res.send({ success: true, products });
    });
});

/**
 * Get products with ids passed by client
 * @returns {Object} data - Products {Array.<Object>}
 */
router.get("/products_by_id", (req, res) => {
  let productIds = req.query.id;
  // Make oriductsIds a string
  productIds = req.query.id.split(",");
  // Find any product with ids provided
  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((error, product) => {
      if (error) {
        return res.status(400).send({ error: error });
      }
      return res.send(product);
    });
});

/**
 * Update product views number
 * @returns {Object} data - Updated product {Array.<Object>}
 */
router.get("/product_by_id", (req, res) => {
  let productId = req.query.id;
  // Find product by _id and increment views by 1
  Product.findOneAndUpdate(
    { _id: productId },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("writer")
    .exec((error, product) => {
      if (error) {
        return res.status(400).send({ error: error });
      }
      return res.status(200).send([product]);
    });
});

/**
 * Get product with filters
 * @returns {Object} data - Products {Array.<Object>}, Array length
 */
router.post("/getProducts", async (req, res) => {
  // {Number} Amount of products to fetch
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  // {String} Last product _id from client products array
  let lastId = req.body.lastId ? req.body.lastId : null;
  // {String} Search value
  let term = req.body.searchTerm ? req.body.searchTerm : null;

  let findArgs = {};
  for (let key in req.body.filters) {
    // If one or more filter exists get in
    if (req.body.filters[key].length > 0) {
      // If the is "price" get in
      if (key === "price") {
        // Create object in findArgs with filters
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  // Get products with filters
  let x = Product.find(findArgs);
  // If term passed add text filter
  if (term) {
    x = x.find({ $text: { $search: term } });
  }
  // If lastId passed add $gt filter by _id
  if (lastId) {
    let ObjectId = require("mongodb").ObjectID;
    x = x.find({ _id: { $gt: ObjectId(lastId) } });
  }

  x.populate("writer")
    .limit(limit)
    .exec((error, productsList) => {
      if (error) {
        return res.status(400).send({ success: false, error });
      }
      res.send({
        success: true,
        productsList,
        postSize: productsList.length,
      });
    });
});

/**
 * Upload a product to DB
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Product {Object}
 * @see validateProduct
 */
router.post("/uploadProduct", authEditorAuth, async (req, res) => {
  const { error } = validateProduct(req.body);
  //If product from client don't match schema, bail
  if (error) {
    return res.status(400).send({ error: "Inputs validation problem" });
  }
  // Create a new product
  const product = await new Product(req.body);
  // Save product to DB
  await product.save();
  // If can't create product bail
  if (!product) {
    return res
      .status(500)
      .send({ error: "Unexpected error, could not save product to database" });
  }
  res.send(product);
});

// Create multer storage Object
const storage = multer.diskStorage({
  destination: "../public/uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Upload image file
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // If not an image file bail
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      return cb("Error: only jpg, png and jpeg are allowed", false);
    } else {
      cb(null, true);
    }
  },
}).single("file");


/**
 * Upload image file 
 * ADMIN / EDITOR authentication
 * @returns {Object} data - Image path, file name
 */
router.post("/uploadImage", authEditorAuth, (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      return res.status(400).send({ success: false, error });
    }
    return res.send({
      success: true,
      image: res.req.file.path.slice(10),
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
