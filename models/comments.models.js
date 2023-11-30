const db = require("../db/connection.js");
const { fetchArticleById } = require("./articles.models.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id).then(() => {
    return db
      .query(
        `SELECT comment_id, votes, created_at, author, body 
        FROM comments 
        WHERE article_id = ${article_id};`
      )
      .then(({ rows }) => {
        return rows;
      });
  });
};

exports.createCommentByArticleId = (username, body, article_id) => {
  if (!body || typeof body !== "string") {
    throw {
      statusCode: 400,
      msg: "Body is required, must be a string, and must not be empty",
    };
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) 
    VALUES ('${username}', '${body}', ${article_id}) 
    RETURNING *;`
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      if (err.constraint === "comments_article_id_fkey")
        throw {
          statusCode: 404,
          msg: "Article not found",
        };
      if (err.constraint === "comments_author_fkey")
        throw {
          statusCode: 404,
          msg: "User not found",
        };
      throw err;
    });
};

exports.removeComment = (comment_id) => {
  if (isNaN(comment_id)) {
    throw { statusCode: 400, msg: "Invalid comment id" };
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = ${comment_id}`)
    .then(({ rowCount }) => {
      if (rowCount < 1) throw { statusCode: 404, msg: "Comment not found" };
    });
};
