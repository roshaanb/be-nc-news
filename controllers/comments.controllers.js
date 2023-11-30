const {
  fetchCommentsByArticleId,
  createCommentByArticleId,
  removeComment,
} = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  createCommentByArticleId(username, body, article_id)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
      .then(() => {
        res.status(204).send(`Comment deleted with id: ${comment_id}`);
      })
      .catch((err) => {
        next(err);
      });
  };
