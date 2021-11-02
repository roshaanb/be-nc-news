const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getArticle } = require("./controllers/articles.controllers")

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticle)

module.exports = app