let env = require("../../environment")

class TestConfiguration {
  constructor(middleware) {
    // env = config.env || {}
    this.middleware = middleware
    this.next = jest.fn()
    this.throwMock = jest.fn()
  }

  callMiddleware(ctx, next) {
    return this.middleware(ctx, next)
  }

  clear() {
    jest.clearAllMocks()
  }

  setEnv(config) {
    env = config
  }

  async init() {
    // return this.createApp(appName)
  }

  end() {
    // this.server.close()
  }
}

module.exports = TestConfiguration
