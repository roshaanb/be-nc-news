const {
  fetchArticleById,
  fetchAllArticles,
  updateArticle,
} = require("../models/articles.models");

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

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((ids) => {
      const results = [];
      ids.forEach((id) => {
        fetchArticleById(id).then((article) => {
          results.push(article);
          if (results.length === ids.length) {
            res.status(200).send({ articles: results });
          }
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};
