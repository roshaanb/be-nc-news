const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return db
    .query(
      `DROP TABLE IF EXISTS
      topics,
      users,
      articles,
      comments
      CASCADE
      ;`
    )
    .then(() => {
      return db.query(
        ` CREATE TABLE topics (
      slug VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
      description VARCHAR(255) NOT NULL
    );`
      );
    })
    .then(() => {
      return db.query(
        ` CREATE TABLE users (
      username VARCHAR(255) NOT NULL PRIMARY KEY,
      avatar_url VARCHAR(360) NOT NULL,
      name VARCHAR(100) NOT NULL
    );`
      );
    })
    .then(() => {
      return db.query(
        ` CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      body VARCHAR(10000) NOT NULL,
      votes INT DEFAULT 0,
      topic VARCHAR(255) NOT NULL REFERENCES topics(slug),
      author VARCHAR(255) NOT NULL REFERENCES users(username),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`
      );
    })
    .then(() => {
      return db.query(
        ` CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      votes INT DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR(10000) NOT NULL
    );`
      );
    })
    .then(() => {
      const topicsArr = topicData.map((topic) => [
        topic.description,
        topic.slug,
      ]);
      const topicsInsertStr = format(
        `INSERT INTO topics
          (description, slug)
        VALUES
          %L`,
        topicsArr
      );
      return db.query(topicsInsertStr);
    })
    .then(() => {
      const usersArr = userData.map((user) => [
        user.username,
        user.name,
        user.avatar_url,
      ]);

      const usersInsertStr = format(
        `INSERT INTO users
          (username, name, avatar_url)
        VALUES
          %L`,
        usersArr
      );
      return db.query(usersInsertStr);
    })
    .then(() => {
      const articlesArr = articleData.map((article) => [
        article.title,
        article.topic,
        article.author,
        article.body,
        article.created_at,
        article.votes,
      ]);

      const articlesInsertStr = format(
        `INSERT INTO articles
          (title, topic, author, body, created_at, votes)
        VALUES
          %L`,
        articlesArr
      );
      return db.query(articlesInsertStr);
    })
    .then(() => {
      const commentsArr = commentData.map((comment) => [
        comment.body,
        comment.votes,
        comment.author,
        comment.article_id,
        comment.created_at,
      ]);

      const commentsInsertStr = format(
        `INSERT INTO comments
          (body, votes, author, article_id, created_at)
        VALUES
          %L`,
        commentsArr
      );
      return db.query(commentsInsertStr);
    });
};

module.exports = seed;
