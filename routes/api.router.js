const apiRouter = require("express").Router();
const articleRouter = require("./articles.router");
const commentRouter = require("./comments.router");
const topicRouter = require("./topics.router");

apiRouter.use("/articles", articleRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
