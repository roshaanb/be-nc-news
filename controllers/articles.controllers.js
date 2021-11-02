const { fetchArticleById } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(() => {
      res.status(404).send({ msg: `No article found for article_id: ${article_id}` });
    });
};
