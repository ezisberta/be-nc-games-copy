const express = require("express");
const app = express();
const {
  getCategories,
  getReviewByID,
  patchReviewByID,
  getUsers,
  getReviews,
  getCommentsByReviewID,
  postCommentByReviewID,
} = require("./controllers/categories.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.post("/api/reviews/:review_id/comments", postCommentByReviewID);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  }
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
