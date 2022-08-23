require("./mocks")
require("../db").init()
const env = require("../environment")
const controllers = require("./controllers")
const supertest = require("supertest")
const { jwt } = require("@budibase/backend-core/auth")
const { Cookies, Headers } = require("@budibase/backend-core/constants")
const { Configs } = require("../constants")
const { users } = require("@budibase/backend-core")
const { createASession } = require("@budibase/backend-core/sessions")
const { TENANT_ID, CSRF_TOKEN } = require("./structures")
const structures = require("./structures")
const { doInTenant } = require("@budibase/backend-core/tenancy")
const { groups } = require("@budibase/pro")
class TestConfiguration {
  constructor(openServer = true) {
    if (openServer) {
      env.PORT = "0" // random port
      this.server = require("../index")
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
    }
  }

  getRequest() {
    return this.request
  }

  // UTILS

  async _req(config, params, controlFunc) {
    const request = {}
    // fake cookies, we don't need them
    request.cookies = { set: () => {}, get: () => {} }
    request.config = { jwtSecret: env.JWT_SECRET }
    request.appId = this.appId
    request.user = { appId: this.appId, tenantId: TENANT_ID }
    request.query = {}
    request.request = {
      body: config,
    }
    request.throw = (status, err) => {
      throw { status, message: err }
    }
    if (params) {
      request.params = params
    }
    await doInTenant(TENANT_ID, () => {
      return controlFunc(request)
    })
    return request.body
  }

  // SETUP / TEARDOWN

  async beforeAll() {
    await this.login()
  }

  async afterAll() {
    if (this.server) {
      await this.server.close()
    }
  }

  // USER / AUTH

  async login() {
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
    await createASession("us_uuid1", {
      sessionId: "sessionid",
      tenantId: TENANT_ID,
      csrfToken: CSRF_TOKEN,
    })
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
      tenantId: TENANT_ID,
    }
    const authToken = jwt.sign(user, env.JWT_SECRET)
    return {
      Accept: "application/json",
      ...this.cookieHeader([`${Cookies.Auth}=${authToken}`]),
      [Headers.CSRF_TOKEN]: CSRF_TOKEN,
    }
  }

  async getUser(email) {
    return doInTenant(TENANT_ID, () => {
      return users.getGlobalUserByEmail(email)
    })
  }

  async getGroup(id) {
    return doInTenant(TENANT_ID, () => {
      return groups.get(id)
    })
  }

  async saveGroup(group) {
    const res = await this.getRequest()
      .post(`/api/global/groups`)
      .send(group)
      .set(this.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body
  }

  async createUser(email, password) {
    const user = await this.getUser(structures.users.email)
    if (user) {
      return user
    }
    await this._req(
      structures.users.user({ email, password }),
      null,
      controllers.users.save
    )
  }

  async saveAdminUser() {
    await this._req(
      structures.users.user({ tenantId: TENANT_ID }),
      null,
      controllers.users.adminUser
    )
  }

  // CONFIGS

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

  // CONFIGS - SETTINGS

  async saveSettingsConfig() {
    await this.deleteConfig(Configs.SETTINGS)
    await this._req(
      structures.configs.settings(),
      null,
      controllers.config.save
    )
  }

  // CONFIGS - GOOGLE

  async saveGoogleConfig() {
    await this.deleteConfig(Configs.GOOGLE)
    await this._req(structures.configs.google(), null, controllers.config.save)
  }

  // CONFIGS - OIDC

  getOIDConfigCookie(configId) {
    const token = jwt.sign(configId, env.JWT_SECRET)
    return this.cookieHeader([[`${Cookies.OIDC_CONFIG}=${token}`]])
  }

  async saveOIDCConfig() {
    await this.deleteConfig(Configs.OIDC)
    const config = structures.configs.oidc()

    await this._req(config, null, controllers.config.save)
    return config
  }

  // CONFIGS - SMTP

  async saveSmtpConfig() {
    await this.deleteConfig(Configs.SMTP)
    await this._req(structures.configs.smtp(), null, controllers.config.save)
  }

  async saveEtherealSmtpConfig() {
    await this.deleteConfig(Configs.SMTP)
    await this._req(
      structures.configs.smtpEthereal(),
      null,
      controllers.config.save
    )
  }
}

module.exports = TestConfiguration
