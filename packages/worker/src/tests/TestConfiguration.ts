import mocks from "./mocks"

// init the licensing mock
import * as pro from "@budibase/pro"
mocks.licenses.init(pro)

// use unlimited license by default
mocks.licenses.useUnlimited()

import * as dbConfig from "../db"
dbConfig.init()
import env from "../environment"
import * as controllers from "./controllers"
const supertest = require("supertest")
import { Config } from "../constants"
import {
  users,
  tenancy,
  sessions,
  auth,
  constants,
  env as coreEnv,
  utils,
  DEFAULT_TENANT_ID,
} from "@budibase/backend-core"
import structures, { TENANT_ID, CSRF_TOKEN } from "./structures"
import { CreateUserResponse, User, AuthToken } from "@budibase/types"
import API from "./api"
import sdk from "../sdk"

enum Mode {
  CLOUD = "cloud",
  SELF = "self",
}

export async function retry<T extends (...arg0: any[]) => any>(
  fn: T,
  maxTry: number = 5,
  retryCount = 1
): Promise<Awaited<ReturnType<T>>> {
  const currRetry = typeof retryCount === "number" ? retryCount : 1
  try {
    const result = await fn()
    return result
  } catch (e) {
    console.log(`Retry ${currRetry} failed.`)
    if (currRetry > maxTry) {
      console.log(`All ${maxTry} retry attempts exhausted`)
      throw e
    }
    return retry(fn, maxTry, currRetry + 1)
  }
}

class TestConfiguration {
  server: any
  request: any
  api: API
  defaultUser?: User
  tenant1User?: User
  #tenantId?: string

  constructor(
    opts: { openServer: boolean; mode: Mode } = {
      openServer: true,
      mode: Mode.CLOUD,
    }
  ) {
    if (opts.mode === Mode.CLOUD) {
      this.modeCloud()
    } else if (opts.mode === Mode.SELF) {
      this.modeSelf()
    }

    if (opts.openServer) {
      env.PORT = "0" // random port
      this.server = require("../index").default
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
    }

    this.api = new API(this)
  }

  getRequest() {
    return this.request
  }

  // MODES

  setMultiTenancy = (value: boolean) => {
    env._set("MULTI_TENANCY", value)
    coreEnv._set("MULTI_TENANCY", value)
  }

  setSelfHosted = (value: boolean) => {
    env._set("SELF_HOSTED", value)
    coreEnv._set("SELF_HOSTED", value)
  }

  modeCloud = () => {
    this.setSelfHosted(false)
    this.setMultiTenancy(true)
  }

  modeSelf = () => {
    this.setSelfHosted(true)
    this.setMultiTenancy(false)
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
    this.#tenantId = `tenant-${utils.newid()}`

    // Running tests in parallel causes issues creating the globaldb twice. This ensures the db is properly created before starting
    await retry(async () => await this.createDefaultUser())
    await this.createSession(this.defaultUser!)

    await tenancy.doInTenant(this.#tenantId, async () => {
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

  createTenant = async ({
    addTenantToGlobalDb,
  }: {
    addTenantToGlobalDb: boolean
  }): Promise<User> => {
    // create user / new tenant
    const res = await this.api.users.createAdminUser()

    // This needs to be added because it was disabled for bulk testing: // https://github.com/Budibase/budibase/issues/6134
    if (addTenantToGlobalDb) {
      await sdk.users.addTenant(res.tenantId, res.userId, res.email)
    }

    // return the created user
    const userRes = await this.api.users.getUser(res.userId, {
      headers: {
        ...this.internalAPIHeaders(),
        [constants.Header.TENANT_ID]: res.tenantId,
      },
    })

    // create a session for the new user
    const user = userRes.body
    await this.createSession(user)

    return user
  }

  getTenantId() {
    try {
      return tenancy.getTenantId()
    } catch (e: any) {
      return DEFAULT_TENANT_ID
    }
  }

  // AUTH

  async _createSession({
    userId,
    tenantId,
  }: {
    userId: string
    tenantId: string
  }) {
    await sessions.createASession(userId!, {
      sessionId: "sessionid",
      tenantId: tenantId,
      csrfToken: CSRF_TOKEN,
    })
  }

  async createSession(user: User) {
    return this._createSession({ userId: user._id!, tenantId: user.tenantId })
  }

  cookieHeader(cookies: any) {
    if (!Array.isArray(cookies)) {
      cookies = [cookies]
    }
    return {
      Cookie: cookies,
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
      ...this.cookieHeader([`${constants.Cookie.Auth}=${authCookie}`]),
      [constants.Header.CSRF_TOKEN]: CSRF_TOKEN,
    }
  }

  defaultHeaders() {
    const tenantId = this.getTenantId()
    if (tenantId === TENANT_ID) {
      return this.authHeaders(this.defaultUser!)
    } else if (tenantId === this.getTenantId()) {
      return this.authHeaders(this.tenant1User!)
    } else {
      throw new Error("could not determine auth headers to use")
    }
  }

  internalAPIHeaders() {
    return { [constants.Header.API_KEY]: env.INTERNAL_API_KEY }
  }

  adminOnlyResponse = () => {
    return { message: "Admin user only endpoint.", status: 403 }
  }

  // USERS

  async createDefaultUser() {
    const user = structures.users.adminUser({
      password: "test",
    })
    this.defaultUser = await this.createUser(user)
  }

  async createTenant1User() {
    const user = structures.users.adminUser({
      password: "test",
    })
    this.tenant1User = await this.createUser(user)
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
    await this.deleteConfig(Config.SETTINGS)
    await this._req(
      structures.configs.settings(),
      null,
      controllers.config.save
    )
  }

  // CONFIGS - GOOGLE

  async saveGoogleConfig() {
    await this.deleteConfig(Config.GOOGLE)
    await this._req(structures.configs.google(), null, controllers.config.save)
  }

  // CONFIGS - OIDC

  getOIDConfigCookie(configId: string) {
    const token = auth.jwt.sign(configId, env.JWT_SECRET)
    return this.cookieHeader([[`${constants.Cookie.OIDC_CONFIG}=${token}`]])
  }

  async saveOIDCConfig() {
    await this.deleteConfig(Config.OIDC)
    const config = structures.configs.oidc()

    await this._req(config, null, controllers.config.save)
    return config
  }

  // CONFIGS - SMTP

  async saveSmtpConfig() {
    await this.deleteConfig(Config.SMTP)
    await this._req(structures.configs.smtp(), null, controllers.config.save)
  }

  async saveEtherealSmtpConfig() {
    await this.deleteConfig(Config.SMTP)
    await this._req(
      structures.configs.smtpEthereal(),
      null,
      controllers.config.save
    )
  }
}

export default TestConfiguration
