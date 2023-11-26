const db = require("../db/connection.js");

exports.fetchAllArticles = (sort_by, order, topic) => {
  sort_by = sort_by || "created_at";
  order = order || "desc";
  // if (
  //   ![
  //     "author",
  //     "title",
  //     "article_id",
  //     "topic",
  //     "created_at",
  //     "votes",
  //     "comments_count",
  //   ].includes(sort_by)
  // ) {
  //   throw { statusCode: 400, msg: "Invalid sort_by query" };
  // }
  return db
    .query(`SELECT * FROM articles ORDER BY ${sort_by} ${order}`)
    .then(({ rows }) => {
      const idsArray = [];
      rows.forEach((article) => {
        idsArray.push(article.article_id);
      });
      return idsArray;
    });
};

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    throw { statusCode: 400, msg: "Invalid article id" };
  }
  const commentQuery = "SELECT * FROM comments WHERE article_id = $1";
  const articleQuery = "SELECT * FROM articles WHERE article_id = $1";
  return db.query(commentQuery, [article_id]).then(({ rows }) => {
    const commentsNum = rows.length;
    return db.query(articleQuery, [article_id]).then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        throw { statusCode: 404, msg: "Article not found" };
      }
      article.comment_count = commentsNum;
      return article;
    });
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
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      const updatedArticle = rows[0];
      return this.fetchArticleById(updatedArticle.article_id);
    });
};
