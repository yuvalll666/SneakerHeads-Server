const express = require("express");
const app = express();

const PORT = process.env.PORT || 3900;

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

app.get("/koko", (req, res) => {
  if (koko) {
    res.send(koko);
  }
});

app.listen(PORT, () =>
  console.log(`Listen on port: ${PORT}.. Click me -> http://localhost/${PORT}`)
);
