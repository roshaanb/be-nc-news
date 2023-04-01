const db = require("../db/connection.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");

const articlesExpectStatement = (article) => {
  expect(article).toMatchObject({
    article_id: expect.any(Number),
    title: expect.any(String),
    body: expect.any(String),
    votes: expect.any(Number),
    topic: expect.any(String),
    author: expect.any(String),
    created_at: expect.any(String),
    comment_count: expect.any(Number),
  });
  expect(article.comment_count).toBeGreaterThan(-1);
};

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  describe("/api/topics", () => {
    describe("GET", () => {
      test("status:200 responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics.length).toBe(3);
            topics.forEach((topic) =>
              expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("status:200 responds with an article object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            articlesExpectStatement(article);
          });
      });
      test("status:200 article object's author key matches the relevant users table", () => {
        const query = "SELECT * FROM users;";
        const usernames = [];
        return db
          .query(query)
          .then(({ rows }) => {
            rows.forEach((user) => usernames.push(user.username));
          })
          .then(() => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(usernames).toContain(article.author);
              });
          });
      });
      test("status:400 responds with an invalid input error when passed an invalid article id", () => {
        return request(app)
          .get("/api/articles/gabagool")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      test("status:200 responds with an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              articlesExpectStatement(article);
            });
          });
      });
      test("status:200 each article object's author key matches the relevant users table", () => {
        const query = "SELECT * FROM users;";
        const usernames = [];
        return db
          .query(query)
          .then(({ rows }) => {
            rows.forEach((user) => usernames.push(user.username));
          })
          .then(() => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                articles.forEach((article) => {
                  expect(usernames).toContain(article.author);
                });
              });
          });
      });
    });
  });
});
