const { fetchAllTopics } = require("../models/topics.models");

exports.getAllTopics = (req, res) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};
