const { fetchArticleById, getIds } = require("../models/articles.models");

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
  getIds().then((ids) => {
    ids.map((id) => fetchArticleById(id));
    console.log(ids);
  });
};
