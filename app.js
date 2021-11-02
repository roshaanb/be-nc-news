const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticle, getArticles } = require("./controllers/articles.controllers");
const { handlePSQLErrors, handlesCustomErrors, handle500 } = require("./controllers/errors.controllers.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles)

app.use(handlePSQLErrors)
app.use(handlesCustomErrors);
app.use(handle500);

module.exports = app;
