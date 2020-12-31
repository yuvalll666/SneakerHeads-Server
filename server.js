const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3900;

mongoose
  .connect(
    `mongodb+srv://yuval:315569533@onlineshop.abqhu.mongodb.net/online-shop?retryWrites=true&w=majority`,
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
  res.send("Hello World");
});

const koko = {
  firstName: "yuval",
  lastName: "azarya",
  email: "yuval@gmail.com",
};

console.log(koko);

app.get("/koko", (req, res) => {
  if (koko) {
    res.send(koko);
  }
});

app.listen(PORT, () =>
  console.log(`Listen on port: ${PORT}.. Click me -> http://localhost/${PORT}`)
);
