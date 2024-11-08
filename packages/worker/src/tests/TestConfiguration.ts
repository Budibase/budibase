import mocks from "./mocks"

// init the licensing mock
mocks.licenses.init(mocks.pro)

// use unlimited license by default
mocks.licenses.useUnlimited()

import * as dbConfig from "../db"

dbConfig.init()
import env from "../environment"
import * as controllers from "./controllers"

import supertest from "supertest"

import { Config } from "../constants"
import {
  users,
  context,
  sessions,
  constants,
  env as coreEnv,
  db as dbCore,
  encryption,
  utils,
} from "@budibase/backend-core"
import structures, { CSRF_TOKEN } from "./structures"
import {
  SaveUserResponse,
  User,
  AuthToken,
  SCIMConfig,
  ConfigType,
} from "@budibase/types"
import API from "./api"
import jwt, { Secret } from "jsonwebtoken"
import cloneDeep from "lodash/fp/cloneDeep"

class TestConfiguration {
  server: any
  request: any
  api: API
  tenantId: string
  user?: User
  apiKey?: string
  userPassword = "password123!"

  constructor(opts: { openServer: boolean } = { openServer: true }) {
    // default to cloud hosting
    this.cloudHosted()

    this.tenantId = structures.tenant.id()

    if (opts.openServer) {
      env.PORT = "0" // random port
      this.server = require("../index").default
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
    }

    this.api = new API(this)
  }

  async useNewTenant() {
    this.tenantId = structures.tenant.id()

    await this.beforeAll()
  }

  getRequest() {
    return this.request
  }

  // HOSTING

  setSelfHosted = (value: boolean) => {
    env._set("SELF_HOSTED", value)
    coreEnv._set("SELF_HOSTED", value)
  }

  cloudHosted = () => {
    this.setSelfHosted(false)
  }

  selfHosted = () => {
    this.setSelfHosted(true)
  }

  // UTILS

  async _req(config: any, params: any, controlFunc: any) {
    const request: any = {}
    // fake cookies, we don't need them
    request.cookies = { set: () => {}, get: () => {} }
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
    await context.doInTenant(this.getTenantId(), () => {
      return controlFunc(request)
    })
    return request.body
  }

  // SETUP / TEARDOWN

  async beforeAll() {
    try {
      await this.createDefaultUser()
      await this.createSession(this.user!)
    } catch (e: any) {
      console.error(e)
      throw new Error(e.message)
    }
  }

  async afterAll() {
    if (this.server) {
      await this.server.close()
    } else {
      await require("../index").default.close()
    }
  }

  // TENANCY

  doInTenant(task: any) {
    return context.doInTenant(this.tenantId, () => {
      return task()
    })
  }

  createTenant = async (): Promise<User> => {
    // create user / new tenant
    const res = await this.api.users.createAdminUser()

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
      return context.getTenantId()
    } catch (e) {
      return this.tenantId!
    }
  }

  // AUTH

  async _createSession({
    userId,
    tenantId,
    email,
  }: {
    userId: string
    tenantId: string
    email: string
  }) {
    await sessions.createASession(userId!, {
      sessionId: "sessionid",
      tenantId,
      csrfToken: CSRF_TOKEN,
      email,
    })
  }

  async createSession(user: User) {
    return this._createSession({
      userId: user._id!,
      tenantId: user.tenantId,
      email: user.email,
    })
  }

  cookieHeader(cookies: any) {
    if (!Array.isArray(cookies)) {
      cookies = [cookies]
    }
    return {
      Cookie: cookies,
    }
  }

  async withUser(user: User, f: () => Promise<void>) {
    const oldUser = this.user
    this.user = user
    try {
      await f()
    } finally {
      this.user = oldUser
    }
  }

  authHeaders(user: User) {
    const authToken: AuthToken = {
      userId: user._id!,
      sessionId: "sessionid",
      tenantId: user.tenantId,
    }
    const authCookie = jwt.sign(authToken, coreEnv.JWT_SECRET as Secret)
    return {
      Accept: "application/json",
      ...this.cookieHeader([`${constants.Cookie.Auth}=${authCookie}`]),
      [constants.Header.CSRF_TOKEN]: CSRF_TOKEN,
    }
  }

  defaultHeaders() {
    return this.authHeaders(this.user!)
  }

  tenantIdHeaders() {
    return { [constants.Header.TENANT_ID]: this.tenantId }
  }

  internalAPIHeaders() {
    return { [constants.Header.API_KEY]: coreEnv.INTERNAL_API_KEY }
  }

  bearerAPIHeaders() {
    return {
      [constants.Header.AUTHORIZATION]: `Bearer ${this.apiKey}`,
    }
  }

  adminOnlyResponse = () => {
    return { message: "Admin user only endpoint.", status: 403 }
  }

  async withEnv(newEnvVars: Partial<typeof env>, f: () => Promise<void>) {
    let cleanup = this.setEnv(newEnvVars)
    try {
      await f()
    } finally {
      cleanup()
    }
  }

  /*
   * Sets the environment variables to the given values and returns a function
   * that can be called to reset the environment variables to their original values.
   */
  setEnv(newEnvVars: Partial<typeof env>): () => void {
    const oldEnv = cloneDeep(env)

    let key: keyof typeof newEnvVars
    for (key in newEnvVars) {
      env._set(key, newEnvVars[key])
    }

    return () => {
      for (const [key, value] of Object.entries(oldEnv)) {
        env._set(key, value)
      }
    }
  }

  // USERS

  async createDefaultUser() {
    const user = structures.users.adminUser({
      password: this.userPassword,
    })
    await context.doInTenant(this.tenantId!, async () => {
      this.user = await this.createUser(user)

      const db = context.getGlobalDB()

      const id = dbCore.generateDevInfoID(this.user!._id!)
      // TODO: dry
      this.apiKey = encryption.encrypt(
        `${this.tenantId}${dbCore.SEPARATOR}${utils.newid()}`
      )
      const devInfo = {
        _id: id,
        userId: this.user!._id,
        apiKey: this.apiKey,
      }
      await db.put(devInfo)
    })
  }

  async getUser(email: string): Promise<User> {
    return context.doInTenant(this.getTenantId(), async () => {
      return (await users.getGlobalUserByEmail(email)) as User
    })
  }

  async createUser(opts?: Partial<User>) {
    let user = structures.users.user()
    if (user) {
      user = { ...user, ...opts }
    }
    const response = await this._req(user, null, controllers.users.save)
    const body = response as SaveUserResponse
    return (await this.getUser(body.email)) as User
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
    const token = jwt.sign(configId, coreEnv.JWT_SECRET as Secret)
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

  // CONFIGS - SCIM

  async setSCIMConfig(enabled: boolean) {
    await this.deleteConfig(Config.SCIM)
    const config: SCIMConfig = {
      type: ConfigType.SCIM,
      config: { enabled },
    }

    await this._req(config, null, controllers.config.save)
    return config
  }
}

export default TestConfiguration
