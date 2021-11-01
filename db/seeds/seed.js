const db = require("../connection.js");
// const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS
      topics,
      users,
      articles,
      comments
      CASCADE
      ;`)
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
      body VARCHAR(360) NOT NULL,
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
      author VARCHAR(255) NOT NULL REFERENCES users(username),
      article_id INT NOT NULL REFERENCES articles(article_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR(360) NOT NULL
    );`
      );
    });

  // 2. insert data
};

module.exports = seed;
