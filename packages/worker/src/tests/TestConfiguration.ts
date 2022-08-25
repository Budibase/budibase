import "./mocks"
import dbConfig from "../db"
dbConfig.init()
import env from "../environment"
import controllers from "./controllers"
const supertest = require("supertest")
import { Configs } from "../constants"
import {
  users,
  tenancy,
  Cookies,
  Headers,
  sessions,
  auth,
} from "@budibase/backend-core"
import { TENANT_ID, TENANT_1, CSRF_TOKEN } from "./structures"
import structures from "./structures"
import { CreateUserResponse, User, AuthToken } from "@budibase/types"

enum Mode {
  ACCOUNT = "account",
  SELF = "self",
}

class TestConfiguration {
  server: any
  request: any
  defaultUser?: User
  tenant1User?: User

  constructor(
    opts: { openServer: boolean; mode: Mode } = {
      openServer: true,
      mode: Mode.ACCOUNT,
    }
  ) {
    if (opts.mode === Mode.ACCOUNT) {
      this.modeAccount()
    } else if (opts.mode === Mode.SELF) {
      this.modeSelf()
    }

    if (opts.openServer) {
      env.PORT = "0" // random port
      this.server = require("../index")
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
    }
  }

  getRequest() {
    return this.request
  }

  // MODES

  modeAccount = () => {
    env.SELF_HOSTED = false
    // @ts-ignore
    env.MULTI_TENANCY = true
    // @ts-ignore
    env.DISABLE_ACCOUNT_PORTAL = false
  }

  modeSelf = () => {
    env.SELF_HOSTED = true
    // @ts-ignore
    env.MULTI_TENANCY = false
    // @ts-ignore
    env.DISABLE_ACCOUNT_PORTAL = true
  }

  // UTILS

  async _req(config: any, params: any, controlFunc: any) {
    const request: any = {}
    // fake cookies, we don't need them
    request.cookies = { set: () => {}, get: () => {} }
    request.config = { jwtSecret: env.JWT_SECRET }
    request.user = { tenantId: this.getTenantId() }
    request.query = {}
    request.request = {
      body: config,
    }
    request.throw = (status: any, err: any) => {
      throw { status, message: err }
    }
    if (params) {
      request.params = params
    }
    await tenancy.doInTenant(this.getTenantId(), () => {
      return controlFunc(request)
    })
    return request.body
  }

  // SETUP / TEARDOWN

  async beforeAll() {
    await this.createDefaultUser()
    await this.createSession(this.defaultUser!)

    await tenancy.doInTenant(TENANT_1, async () => {
      await this.createTenant1User()
      await this.createSession(this.tenant1User!)
    })
  }

  async afterAll() {
    if (this.server) {
      await this.server.close()
    }
  }

  // TENANCY

  getTenantId() {
    try {
      return tenancy.getTenantId()
    } catch (e: any) {
      return TENANT_ID
    }
  }

  // USER / AUTH

  async createDefaultUser() {
    const user = structures.users.adminUser({
      email: "test@test.com",
      password: "test",
    })
    this.defaultUser = await this.createUser(user)
  }

  async createTenant1User() {
    const user = structures.users.adminUser({
      email: "tenant1@test.com",
      password: "test",
    })
    this.tenant1User = await this.createUser(user)
  }

  async createSession(user: User) {
    await sessions.createASession(user._id!, {
      sessionId: "sessionid",
      tenantId: user.tenantId,
      csrfToken: CSRF_TOKEN,
    })
  }

  cookieHeader(cookies: any) {
    return {
      Cookie: [cookies],
    }
  }

  authHeaders(user: User) {
    const authToken: AuthToken = {
      userId: user._id!,
      sessionId: "sessionid",
      tenantId: user.tenantId,
    }
    const authCookie = auth.jwt.sign(authToken, env.JWT_SECRET)
    return {
      Accept: "application/json",
      ...this.cookieHeader([`${Cookies.Auth}=${authCookie}`]),
      [Headers.CSRF_TOKEN]: CSRF_TOKEN,
    }
  }

  defaultHeaders() {
    const tenantId = this.getTenantId()
    if (tenantId === TENANT_ID) {
      return this.authHeaders(this.defaultUser!)
    } else if (tenantId === TENANT_1) {
      return this.authHeaders(this.tenant1User!)
    } else {
      throw new Error("could not determine auth headers to use")
    }
  }

  async getUser(email: string): Promise<User> {
    return tenancy.doInTenant(this.getTenantId(), () => {
      return users.getGlobalUserByEmail(email)
    })
  }

  async createUser(user?: User) {
    if (!user) {
      user = structures.users.user()
    }
    const response = await this._req(user, null, controllers.users.save)
    const body = response as CreateUserResponse
    return this.getUser(body.email)
  }

  // CONFIGS

  async deleteConfig(type: any) {
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

  getOIDConfigCookie(configId: string) {
    const token = auth.jwt.sign(configId, env.JWT_SECRET)
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

export = TestConfiguration
