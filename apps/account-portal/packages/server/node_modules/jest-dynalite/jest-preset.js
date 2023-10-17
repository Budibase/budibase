const { resolve } = require("path");

module.exports = {
  setupFilesAfterEnv: [
    resolve(__dirname, "./setupTables.js"),
    resolve(__dirname, "./clearAfterEach.js"),
  ],
  testEnvironment: resolve(__dirname, "./environment.js"),
};
