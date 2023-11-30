const { getAllTopics } = require("../controllers/topics.controllers");

const topicRouter = require("express").Router();

topicRouter.get("/", getAllTopics);

module.exports = topicRouter;
