const env = require("../../../../environment")
const controllers = require("./controllers")
const supertest = require("supertest")
const { jwt } = require("@budibase/auth").auth
const { Cookies } = require("@budibase/auth").constants
const { Configs } = require("../../../../constants")

class TestConfiguration {
  constructor(openServer = true) {
    if (openServer) {
      env.PORT = 4003
      this.server = require("../../../../index")
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
    }
  }

  getRequest() {
    return this.request
  }

  async _req(config, params, controlFunc) {
    const request = {}
    // fake cookies, we don't need them
    request.cookies = { set: () => {}, get: () => {} }
    request.config = { jwtSecret: env.JWT_SECRET }
    request.appId = this.appId
    request.user = { appId: this.appId }
    request.request = {
      body: config,
    }
    if (params) {
      request.params = params
    }
    await controlFunc(request)
    return request.body
  }

  async init() {
    // create a test user
    await this._req({
      _id: "us_uuid1",
      builder: {
        global: true,
      }
    }, null, controllers.users.save)
  }

  defaultHeaders() {
    const user = {
      _id: "us_uuid1",
      userId: "us_uuid1",
    }
    const authToken = jwt.sign(user, env.JWT_SECRET)
    return {
      Accept: "application/json",
      Cookie: [
        `${Cookies.Auth}=${authToken}`,
      ],
    }
  }

  async saveSettingsConfig() {
    await this._req({
      type: Configs.SETTINGS,
      config: {
        url: "http://localhost:10000",
        logoUrl: "http://localhost:10000/logo",
        company: "TestCompany",
      }
    }, null, controllers.config.save)
  }

  async saveSmtpConfig() {
    await this._req({
      type: Configs.SMTP,
      config: {
        port: 12345,
        host: "smtptesthost.com",
        from: "testfrom@test.com",

      }
    }, null, controllers.config.save)
  }
}

module.exports = TestConfiguration