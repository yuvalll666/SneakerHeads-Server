const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3900;
const { Product } = require("./models/product");

mongoose
  .connect(
    `mongodb+srv://yuval:${process.env.MONGO_PASSWORD}@onlineshop.abqhu.mongodb.net/online-shop?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("connected to mongoose successfuly!!"))
  .catch(() => console.log("Failed to connect to mongoose"));

app.use(require("morgan")("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(process.env.KOKO);
});

console.log(process.env.KOKO);
const koko = {
  firstName: "yuval",
  lastName: "azarya",
  email: "yuval@gmail.com",
};

app.get("/products", (req, res) => {
  console.log("in the shit");
  Product.find({}).exec((err, products) => {
    res.send(products);
  });
});

app.get("/koko", (req, res) => {
  if (koko) {
    res.send(koko);
  }
});

app.listen(PORT, () =>
  console.log(`Listen on port: ${PORT}.. Click me -> http://localhost/${PORT}`)
);
