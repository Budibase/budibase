const env = require("../../../../environment")
const controllers = require("./controllers")
const supertest = require("supertest")
const { jwt } = require("@budibase/auth").auth
const { Cookies } = require("@budibase/auth").constants
const { Configs, LOGO_URL } = require("../../../../constants")
const { getGlobalUserByEmail } = require("@budibase/auth").utils
const { createASession } = require("@budibase/auth/sessions")
const { newid } = require("../../../../../../auth/src/hashing")

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
    request.query = {}
    request.request = {
      body: config,
    }
    if (params) {
      request.params = params
    }
    await controlFunc(request)
    return request.body
  }

  async init(createUser = true) {
    if (createUser) {
      // create a test user
      await this._req(
        {
          email: "test@test.com",
          password: "test",
          _id: "us_uuid1",
          builder: {
            global: true,
          },
          admin: {
            global: true,
          },
        },
        null,
        controllers.users.save
      )
      await createASession("us_uuid1", "sessionid")
    }
  }

  async end() {
    if (this.server) {
      await this.server.close()
    }
  }

  cookieHeader(cookies) {
    return {
      Cookie: [cookies],
    }
  }

  defaultHeaders() {
    const user = {
      _id: "us_uuid1",
      userId: "us_uuid1",
      sessionId: "sessionid",
    }
    const authToken = jwt.sign(user, env.JWT_SECRET)
    return {
      Accept: "application/json",
      ...this.cookieHeader([`${Cookies.Auth}=${authToken}`]),
    }
  }

  async getUser(email) {
    return getGlobalUserByEmail(email)
  }

  async createUser(email = "test@test.com", password = "test") {
    const user = await this.getUser(email)
    if (user) {
      return user
    }
    await this._req(
      {
        email,
        password,
      },
      null,
      controllers.users.save
    )
  }

  async deleteConfig(type) {
    try {
      const cfg = await this._req(
        null,
        {
          type,
        },
        controllers.config.find
      )
      if (cfg) {
        await this._req(
          null,
          {
            id: cfg._id,
            rev: cfg._rev,
          },
          controllers.config.destroy
        )
      }
    } catch (err) {
      // don't need to handle error
    }
  }

  async saveSettingsConfig() {
    await this.deleteConfig(Configs.SETTINGS)
    await this._req(
      {
        type: Configs.SETTINGS,
        config: {
          platformUrl: "http://localhost:10000",
          logoUrl: LOGO_URL,
          company: "Budibase",
        },
      },
      null,
      controllers.config.save
    )
  }

  async saveOAuthConfig() {
    await this.deleteConfig(Configs.GOOGLE)
    await this._req(
      {
        type: Configs.GOOGLE,
        config: {
          callbackURL: "http://somecallbackurl",
          clientID: "clientId",
          clientSecret: "clientSecret",
        },
      },
      null,
      controllers.config.save
    )
  }

  getOIDConfigCookie(configId) {
    const token = jwt.sign(configId, env.JWT_SECRET)
    return this.cookieHeader([[`${Cookies.OIDC_CONFIG}=${token}`]])
  }

  async saveOIDCConfig() {
    await this.deleteConfig(Configs.OIDC)
    const config = {
      type: Configs.OIDC,
      config: {
        configs: [
          {
            configUrl: "http://someconfigurl",
            clientID: "clientId",
            clientSecret: "clientSecret",
            logo: "Microsoft",
            name: "Active Directory",
            uuid: newid(),
          },
        ],
      },
    }

    await this._req(config, null, controllers.config.save)
    return config
  }

  async saveSmtpConfig() {
    await this.deleteConfig(Configs.SMTP)
    await this._req(
      {
        type: Configs.SMTP,
        config: {
          port: 12345,
          host: "smtptesthost.com",
          from: "testfrom@test.com",
          subject: "Hello!",
        },
      },
      null,
      controllers.config.save
    )
  }

  async saveEtherealSmtpConfig() {
    await this.deleteConfig(Configs.SMTP)
    await this._req(
      {
        type: Configs.SMTP,
        config: {
          port: 587,
          host: "smtp.ethereal.email",
          secure: false,
          auth: {
            user: "don.bahringer@ethereal.email",
            pass: "yCKSH8rWyUPbnhGYk9",
          },
        },
      },
      null,
      controllers.config.save
    )
  }

  async saveAdminUser() {
    await this._req(
      {
        email: "testuser@test.com",
        password: "test@test.com",
      },
      null,
      controllers.users.adminUser
    )
  }
}

module.exports = TestConfiguration
