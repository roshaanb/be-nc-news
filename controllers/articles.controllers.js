const { fetchArticleById, fetchIds } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchIds().then((ids) => {
    const results = [];
    ids.forEach((id) => {
      fetchArticleById(id).then((article) => {
        results.push(article);
        if (results.length === ids.length) {
          res.status(200).send({ articles: results });
        }
      });
    });
  });
};
