const {
  fetchCategories,
  fetchReviewByID,
} = require("../models/categories.model");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.send({ categories });
  });
};

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewByID(review_id)
    .then((review) => {
      res.send(review);
    })
    .catch(next);
};
