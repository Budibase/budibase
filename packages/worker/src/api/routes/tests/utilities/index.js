const TestConfig = require("./TestConfiguration")

let request, config

exports.beforeAll = () => {
  config = new TestConfig()
  request = config.getRequest()
}

exports.afterAll = () => {
  if (config) {
    config.end()
  }
  request = null
  config = null
}

exports.getRequest = () => {
  if (!request) {
    exports.beforeAll()
  }
  return request
}

exports.getConfig = () => {
  if (!config) {
    exports.beforeAll()
  }
  return config
}
