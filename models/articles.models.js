const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  const commentQuery = "SELECT * FROM comments WHERE article_id = $1";
  const articleQuery = "SELECT * FROM articles WHERE article_id = $1";

  return db.query(commentQuery, [article_id]).then(({ rows }) => {
    const commentsNum = rows.length;
    return db.query(articleQuery, [article_id]).then(({ rows }) => {
      const article = rows[0];
      article.comment_count = commentsNum;
      return article;
    });
  });
};

exports.fetchIds = (sort_by, order, topic) => {
  
  const { sort_by, order, topic } = req.params;

  return db.query("SELECT * FROM articles").then(({ rows }) => {
    const idsArray = [];
    rows.forEach((article) => {
      idsArray.push(article.article_id);
    });
    return idsArray;
  });
};
