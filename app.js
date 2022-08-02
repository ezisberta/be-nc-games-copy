const express = require("express");
const app = express();
const {
  getCategories,
  getReviewByID,
} = require("./controllers/categories.controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
