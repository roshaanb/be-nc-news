const db = require("../db/connection.js");

exports.fetchAllArticles = () => {
  // const { sort_by, order, topic } = req.params;

  return db.query("SELECT * FROM articles").then(({ rows }) => {
    const idsArray = [];
    rows.forEach((article) => {
      idsArray.push(article.article_id);
    });
    return idsArray;
  });
};

exports.fetchArticleById = (article_id) => {
  const commentQuery = "SELECT * FROM comments WHERE article_id = $1";
  const articleQuery = "SELECT * FROM articles WHERE article_id = $1";

  return db.query(commentQuery, [article_id]).then(({ rows }) => {
    const commentsNum = rows.length;
    return db.query(articleQuery, [article_id]).then(({ rows }) => {
      const article = rows[0];
      if (article) {
        article.comment_count = commentsNum;
        //make this error handle happen in controller/app
        return article;
      } else {
        return {
          type: "Error",
        };
      }
    });
  });
};

exports.updateArticle = (inc_votes, article_id) => {
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
