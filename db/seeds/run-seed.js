const devData = require("../data/development-data/index.js");
const testData = require("../data/test-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
  seed(devData).then(() => db.end());
  // replace seed arg with devData/testData when needed
};

runSeed();
