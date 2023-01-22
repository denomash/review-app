const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/review_app")
  .then(() => {
    console.log("db is connected!");
  })
  .catch((err) => {
    console.log("db connection failed: ", err);
  });
