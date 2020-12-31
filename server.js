const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");
// const { User } = require("./models/user");
const jwt = require("jsonwebtoken");
const { localUrl } = require("./config");
const path = require("path");

const PORT = process.env.PORT || 3900;
// const { Product } = require("./models/product");

// Connect to atlas mongoDB
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
  .catch(() => console.log(err, "Failed to connect to mongoose", err));

// Allow access from diffrent ports
app.use(cors());
// Watch for server changes
app.use(require("morgan")("dev"));
app.use(express.json());

// app.use("/api/users", require("./routes/users"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/products", require("./routes/products"));

// Updates user to confiremed user
app.get("/confirmation/:token", async (req, res) => {
  try {
    // Verify EMAIL_SECRET exists in token
    const data = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    if (data) {
      // Update user
      await User.findOneAndUpdate({ _id: data._id }, { confirmed: true });
      // Redirect to confirmation page
      return res.redirect(`${localUrl}/confirmation`);
    } else {
      return res.send("Error");
    }
  } catch (e) {
    return res.send({ error: e });
  }
});

// This middleware informs the express application to serve our compiled React files
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Catch any bad requests
app.get("*", (req, res) => {
  res.status(200).json({
    msg: "Catch All",
  });
});

// Listen on port 3900
app.listen(PORT, () =>
  console.log(
    `Listening on port: ${PORT}.. Click me -> http://localhost/${PORT}`
  )
);
