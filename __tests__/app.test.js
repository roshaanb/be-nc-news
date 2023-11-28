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
          .then(({ body: [article] }) => {
            articlesExpectStatement(article);
          });
      });
      test("status:200 article object's author key matches the relevant users table", () => {
        const usernames = [];
        return db
          .query("SELECT * FROM users;")
          .then(({ rows }) => {
            rows.forEach((user) => usernames.push(user.username));
          })
          .then(() => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: [article] }) => {
                articlesExpectStatement(article);
                expect(usernames).toContain(article.author);
              });
          });
      });
      test("status:400 responds with an invalid article id error when passed a string for article id", () => {
        return request(app)
          .get("/api/articles/gabagool")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid article id");
          });
      });
      test("status:404 responds with an article not found error when passed an invalid number for article id", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
    });
    describe("PATCH", () => {
      test("status 200: responds with updated article object and increments votes", () => {
        return db
          .query("SELECT votes FROM articles WHERE article_id = 1")
          .then(({ rows }) => {
            const originalVotes = rows[0].votes;
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -50 })
              .expect(200)
              .then(
                ({
                  body: {
                    article: [article],
                  },
                }) => {
                  const expectedVotes = originalVotes - 50;
                  articlesExpectStatement(article);
                  expect(article).toHaveProperty("votes", expectedVotes);
                }
              );
          });
      });
      test("status 400: responds with a value required error when not passed a value for inc_votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Value for inc_votes required and should be an integer"
            );
          });
      });
      test("status 400: responds with invalid input error when passed a string for inc_votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "barb" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Value for inc_votes required and should be an integer"
            );
          });
      });
      test("status 400: responds with invalid input error when passed a decimal for inc_votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -3.1415 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Value for inc_votes required and should be an integer"
            );
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
          .then(({ body: articles }) => {
            articles.forEach((article) => {
              articlesExpectStatement(article);
            });
          });
      });
      test("status:200 each article's author key matches the relevant users table", () => {
        return db
          .query("SELECT * FROM users;")
          .then(({ rows }) => {
            return (usernames = rows.map((user) => user.username));
          })
          .then(() => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: articles }) => {
                articles.forEach((article) => {
                  articlesExpectStatement(article);
                  expect(usernames).toContain(article.author);
                });
              });
          });
      });
      test("status:200 array of article objects sorted by date descending by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: articles }) => {
            articles.forEach((article) => {
              articlesExpectStatement(article);
            });
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("status:200 articles sorted by author in ascending order", () => {
        return request(app)
          .get("/api/articles/")
          .query({ sort_by: "author", order: "asc" })
          .expect(200)
          .then(({ body: articles }) => {
            articles.forEach((article) => {
              articlesExpectStatement(article);
            });
            expect(articles).toBeSortedBy("author", { descending: false });
          });
      });
      test("status:200 articles sorted by comment_count in descending order", () => {
        return request(app)
          .get("/api/articles/")
          .query({ sort_by: "comment_count", order: "desc" })
          .expect(200)
          .then(({ body: articles }) => {
            articles.forEach((article) => {
              articlesExpectStatement(article);
            });
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      test("status:200 articles filters by topic", () => {
        return request(app)
          .get("/api/articles")
          .query({ topic: "mitch" })
          .expect(200)
          .then(({ body: articles }) => {
            const topics = [articles[0].topic];
            articles.forEach((article) => {
              articlesExpectStatement(article);
              expect(topics).toContain(article.topic);
            });
          });
      });
      test("status:400 responds with an invalid sort_by query error when passed an incorrect input for sort_by", () => {
        return request(app)
          .get("/api/articles/")
          .query({ sort_by: "gabagool" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort_by query");
          });
      });
      test("status:400 responds with an invalid order query error when passed an incorrect input for order", () => {
        return request(app)
          .get("/api/articles/")
          .query({ order: 31415 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid order query");
          });
      });
      test("status:400 responds with an invalid topic query error when passed an incorrect input for topic", () => {
        return request(app)
          .get("/api/articles/")
          .query({ topic: ";;;" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic must be a string");
          });
      });
      test("status:404 responds with a topic not found error when passed an invalid topic string", () => {
        return request(app)
          .get("/api/articles/")
          .query({ topic: "barb" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic not found");
          });
      });
    });
  });
});
