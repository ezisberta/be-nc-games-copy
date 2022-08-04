const {
  fetchCategories,
  fetchReviewByID,
  updateReviewByID,
  fetchUsers,
  fetchReviews,
  fetchCommentsByReviewID,
  insertCommentByReviewID,
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
      res.send({ review });
    })
    .catch(next);
};

exports.patchReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  const incVotes = req.body.inc_votes;
  updateReviewByID(review_id, incVotes)
    .then((review) => {
      res.send({ review });
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.send({ users });
  });
};

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.send({ reviews });
  });
};

exports.getCommentsByReviewID = (req, res, next) => {
  const { review_id } = req.params;

  fetchCommentsByReviewID(review_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postCommentByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  const author = req.body.username;
  const body = req.body.body;

  insertCommentByReviewID(review_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
