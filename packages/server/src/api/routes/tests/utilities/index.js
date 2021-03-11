const TestConfig = require("./TestConfiguration")
const env = require("../../../../environment")

exports.delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let request, config

exports.beforeAll = () => {
  config = new TestConfig()
  request = config.getRequest()
}

exports.afterAll = () => {
  if (config) {
    config.end()
  }
  // clear app files

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

exports.switchToCloudForFunction = async func => {
  // self hosted stops any attempts to Dynamo
  env.CLOUD = true
  env.SELF_HOSTED = true
  let error
  try {
    await func()
  } catch (err) {
    error = err
  }
  env.CLOUD = false
  env.SELF_HOSTED = false
  // don't throw error until after reset
  if (error) {
    throw error
  }
}
