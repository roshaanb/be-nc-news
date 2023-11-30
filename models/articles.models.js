const db = require("../db/connection.js");

exports.fetchAllArticles = (sort_by, order, topic) => {
  sort_by = sort_by || "created_at";
  order = order || "desc";

  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    throw { statusCode: 400, msg: "Invalid sort_by query" };
  }
  if (!["desc", "asc"].includes(order)) {
    throw { statusCode: 400, msg: "Invalid order query" };
  }
  if (!/^[a-zA-Z]+$/.test(topic)) {
    throw { statusCode: 400, msg: "Topic must be a string" };
  }

  const topicQuery = topic ? `WHERE topic='${topic}'` : ``;

  return db
    .query(
      `SELECT articles.*, CAST(COALESCE(commentsShortened.comment_count, 0) AS INT) as comment_count
     FROM articles
     LEFT JOIN (SELECT COUNT(article_id) AS comment_count, article_id
     FROM comments
     GROUP BY article_id) as commentsShortened
     ON articles.article_id = commentsShortened.article_id
     ${topicQuery}
     ORDER BY ${sort_by} ${order}
     ;`
    )
    .then(({ rows }) => {
      if (!rows.length) throw { statusCode: 404, msg: "Topic not found" };
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    throw { statusCode: 400, msg: "Invalid article id" };
  }

  return db
    .query(
      `SELECT articles.*, CAST(COALESCE(commentsShortened.comment_count, 0) AS INT) as comment_count
     FROM articles
     LEFT JOIN (SELECT COUNT(article_id) AS comment_count, article_id
     FROM comments
     GROUP BY article_id) as commentsShortened
     ON articles.article_id = commentsShortened.article_id
     WHERE articles.article_id = ${article_id};`
    )
    .then(({ rows }) => {
      if (rows.length < 1) throw { statusCode: 404, msg: "Article not found" };
      console.log(rows[0]);
      return rows[0];
    });
};

exports.updateArticle = (inc_votes, article_id) => {
  if (
    !inc_votes ||
    typeof inc_votes != "number" ||
    !Number.isInteger(inc_votes)
  )
    throw {
      statusCode: 400,
      msg: "Value for inc_votes required and should be an integer",
    };

  return db
    .query(
      `UPDATE articles
        SET votes = votes + ${inc_votes}
        WHERE article_id = ${article_id}
        RETURNING *`
    )
    .then(({ rows }) => {
      const updatedArticle = rows[0];
      return this.fetchArticleById(updatedArticle.article_id);
    });
};
