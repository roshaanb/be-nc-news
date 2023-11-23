const {
  getAllArticles,
  getArticle,
  patchArticle,
} = require("../controllers/articles.controllers");

const articleRouter = require("express").Router();

articleRouter.get("/", getAllArticles);
articleRouter.route("/:article_id").get(getArticle).patch(patchArticle);

module.exports = articleRouter;
