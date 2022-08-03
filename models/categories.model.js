const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewByID = (revID) => {
  return db
    .query("SELECT * FROM reviews WHERE review_ID=$1", [revID])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
      return rows[0];
    });
};

exports.updateReviewByID = (revID, incVotes) => {
  return db
    .query(
      "UPDATE reviews SET votes = votes +$2 WHERE review_ID=$1 RETURNING *;",
      [revID, incVotes]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};
