const db = require("../db/connection");

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
