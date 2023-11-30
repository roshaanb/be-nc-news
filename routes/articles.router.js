const {
  getAllArticles,
  getArticle,
  patchArticle,
} = require("../controllers/articles.controllers");
const {
  getComments,
  postComment,
} = require("../controllers/comments.controllers");

const articleRouter = require("express").Router();

articleRouter.get("/", getAllArticles);
articleRouter.route("/:article_id").get(getArticle).patch(patchArticle);
articleRouter.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = articleRouter;
