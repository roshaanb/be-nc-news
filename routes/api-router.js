const apiRouter = require("express").Router();
const articleRouter = require("./articles-router");
const topicRouter = require("./topics-router");

apiRouter.use("/articles", articleRouter);
apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
