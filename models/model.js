const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewByID = (revID) => {
  return db
    .query(
      "SELECT reviews.* , COUNT(comments.review_ID) :: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id=$1 GROUP BY reviews.review_id;",
      [revID]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No review_id: ${revID}`,
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

exports.fetchReviews = (where, cat, sort, order) => {
  if (cat) {
    where = `WHERE reviews.category='${cat}' `;
    return db
      .query("SELECT * FROM categories WHERE slug=$1", [cat])
      .then(({ rows }) => {
        if (rows[0]) {
          return db
            .query(
              `SELECT reviews.*, COUNT(comments.review_id) :: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id ${where}GROUP BY reviews.review_id ORDER BY ${sort} ${order};`
            )
            .then(({ rows }) => {
              return rows;
            });
        } else {
          return Promise.reject({
            status: 400,
            msg: `Bad Request, this category doesn't exist: ${cat}`,
          });
        }
      });
  }
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) :: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id ${where}GROUP BY reviews.review_id ORDER BY ${sort} ${order};`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByReviewID = (revID) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query("SELECT * FROM comments WHERE review_id=$1", [revID])
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};

exports.insertCommentByReviewID = (revID, auth, body) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query(
            "INSERT INTO comments (review_id, author, body) VALUES ($1,$2,$3) RETURNING*",
            [revID, auth, body]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};

exports.deleteCommentByID = (comID) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [comID])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${comID}`,
        });
      }
    });
};
