const { isDatasourceTest } = require(".")

module.exports = paths => {
  return {
    filtered: paths
      .filter(path => isDatasourceTest(path))
      .map(path => ({ test: path })),
  }
}
