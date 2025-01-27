import { generator, mocks, structures } from "@budibase/backend-core/tests"

// init the licensing mock
import * as pro from "@budibase/pro"
import { init as dbInit } from "../../db"
import env from "../../environment"
import {
  basicAutomation,
  basicAutomationResults,
  basicDatasource,
  basicLayout,
  basicQuery,
  basicRole,
  basicRow,
  basicScreen,
  basicTable,
  basicWebhook,
} from "./structures"
import {
  cache,
  constants,
  context,
  db as dbCore,
  encryption,
  env as coreEnv,
  roles,
  sessions,
  tenancy,
  utils,
} from "@budibase/backend-core"
import {
  app as appController,
  deploy as deployController,
  role as roleController,
  automation as automationController,
  webhook as webhookController,
  query as queryController,
  screen as screenController,
  layout as layoutController,
  view as viewController,
} from "./controllers"

import { cleanup } from "../../utilities/fileSystem"
import { generateUserMetadataID } from "../../db/utils"
import { startup } from "../../startup"
import supertest from "supertest"
import {
  App,
  AuthToken,
  Automation,
  CreateViewRequest,
  Datasource,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Layout,
  Query,
  RelationshipFieldMetadata,
  RelationshipType,
  Row,
  Screen,
  RowSearchParams,
  SourceName,
  Table,
  TableSourceType,
  User,
  UserCtx,
  View,
  Webhook,
  WithRequired,
} from "@budibase/types"

import API from "./api"
import jwt, { Secret } from "jsonwebtoken"
import { Server } from "http"

const newid = utils.newid

mocks.licenses.init(pro)

// use unlimited license by default
mocks.licenses.useUnlimited()

dbInit()

export interface CreateAppRequest {
  appName: string
  url?: string
  snippets?: any[]
}

export interface TableToBuild extends Omit<Table, "sourceId" | "sourceType"> {
  sourceId?: string
  sourceType?: TableSourceType
}

export default class TestConfiguration {
  server?: Server
  request?: supertest.SuperTest<supertest.Test>
  started: boolean
  appId?: string
  allApps: App[]
  app?: App
  prodApp?: App
  prodAppId?: string
  user?: User
  userMetadataId?: string
  table?: Table
  automation?: Automation
  datasource?: Datasource
  tenantId?: string
  api: API
  csrfToken?: string
  temporaryHeaders?: Record<string, string | string[]>

  constructor(openServer = true) {
    if (openServer) {
      // use a random port because it doesn't matter
      env.PORT = "0"
      this.server = require("../../app").getServer()
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
      this.started = true
    } else {
      this.started = false
    }
    this.appId = undefined
    this.allApps = []

    this.api = new API(this)
  }

  getRequest() {
    return this.request
  }

  getApp() {
    if (!this.app) {
      throw new Error("app has not been initialised, call config.init() first")
    }
    return this.app
  }

  getProdApp() {
    if (!this.prodApp) {
      throw new Error(
        "prodApp has not been initialised, call config.init() first"
      )
    }
    return this.prodApp
  }

  getAppId() {
    if (!this.appId) {
      throw new Error(
        "appId has not been initialised, call config.init() first"
      )
    }
    return this.appId
  }

  getProdAppId() {
    if (!this.prodAppId) {
      throw new Error(
        "prodAppId has not been initialised, call config.init() first"
      )
    }
    return this.prodAppId
  }

  getUser(): User {
    if (!this.user) {
      throw new Error("User has not been initialised, call config.init() first")
    }
    return this.user
  }

  getUserDetails() {
    const user = this.getUser()
    return {
      globalId: user._id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  getAutomation() {
    if (!this.automation) {
      throw new Error(
        "automation has not been initialised, call config.init() first"
      )
    }
    return this.automation
  }

  getDatasource() {
    if (!this.datasource) {
      throw new Error(
        "datasource has not been initialised, call config.init() first"
      )
    }
    return this.datasource
  }

  async doInContext<T>(
    appId: string | undefined,
    task: () => Promise<T>
  ): Promise<T> {
    const tenant = this.getTenantId()
    return tenancy.doInTenant(tenant, () => {
      if (!appId) {
        appId = this.appId
      }

      // check if already in a context
      if (context.getAppId() == null && appId) {
        return context.doInAppContext(appId, async () => {
          return task()
        })
      } else {
        return task()
      }
    })
  }

  // SETUP /  TEARDOWN

  // use a new id as the name to avoid name collisions
  async init(appName = newid()) {
    if (!this.started) {
      await startup()
    }
    return this.newTenant(appName)
  }

  end() {
    if (!this) {
      return
    }

    if (this.server) {
      this.server.close()
    } else {
      require("../../app").getServer().close()
    }
    if (this.allApps) {
      cleanup(this.allApps.map(app => app.appId))
    }
  }

  async withUser(user: User, f: () => Promise<void>) {
    const oldUser = this.user
    this.user = user
    try {
      return await f()
    } finally {
      this.user = oldUser
    }
  }

  async withApp(app: App | string, f: () => Promise<void>) {
    const oldAppId = this.appId
    this.appId = typeof app === "string" ? app : app.appId
    try {
      return await f()
    } finally {
      this.appId = oldAppId
    }
  }

  // UTILS

  _req<Req extends Record<string, any> | void, Res>(
    handler: (ctx: UserCtx<Req, Res>) => Promise<void>,
    body?: Req,
    params?: Record<string, string | undefined>
  ): Promise<Res> {
    // create a fake request ctx
    const request: any = {}
    const appId = this.appId
    request.appId = appId
    // fake cookies, we don't need them
    request.cookies = { set: () => {}, get: () => {} }
    request.user = { appId, tenantId: this.getTenantId() }
    request.query = {}
    request.request = {
      body,
    }
    if (params) {
      request.params = params
    }
    request.throw = (status: number, message: string) => {
      throw new Error(`Error ${status} - ${message}`)
    }
    return this.doInContext(appId, async () => {
      await handler(request)
      return request.body
    })
  }

  // USER / AUTH
  async globalUser(config: Partial<User> = {}): Promise<User> {
    const {
      _id = `us_${newid()}`,
      firstName = generator.first(),
      lastName = generator.last(),
      builder = { global: true },
      admin = { global: false },
      email = generator.email({ domain: "example.com" }),
      tenantId = this.getTenantId(),
      roles = {},
    } = config

    const db = tenancy.getTenantDB(this.getTenantId())
    let existing: Partial<User> = {}
    try {
      existing = await db.get<User>(_id)
    } catch (err) {
      // ignore
    }
    const user: User = {
      _id,
      ...existing,
      ...config,
      _rev: existing._rev,
      email,
      roles,
      tenantId,
      firstName,
      lastName,
      builder,
      admin,
    }
    await sessions.createASession(_id, {
      sessionId: this.sessionIdForUser(_id),
      tenantId: this.getTenantId(),
      csrfToken: this.csrfToken,
      email,
    })
    const resp = await db.put(user)
    await cache.user.invalidateUser(_id)
    return {
      _rev: resp.rev,
      ...user,
    }
  }

  async createUser(user: Partial<User> = {}): Promise<User> {
    return await this.globalUser(user)
  }

  async createGroup(roleId: string = roles.BUILTIN_ROLE_IDS.BASIC) {
    return context.doInTenant(this.tenantId!, async () => {
      const baseGroup = structures.userGroups.userGroup()
      baseGroup.roles = {
        [this.getProdAppId()]: roleId,
      }
      const { id, rev } = await pro.sdk.groups.save(baseGroup)
      return {
        _id: id,
        _rev: rev,
        ...baseGroup,
      }
    })
  }

  async addUserToGroup(groupId: string, userId: string) {
    return context.doInTenant(this.tenantId!, async () => {
      await pro.sdk.groups.addUsers(groupId, [userId])
    })
  }

  async removeUserFromGroup(groupId: string, userId: string) {
    return context.doInTenant(this.tenantId!, async () => {
      await pro.sdk.groups.removeUsers(groupId, [userId])
    })
  }

  sessionIdForUser(userId: string): string {
    return `sessionid-${userId}`
  }

  async login({
    roleId,
    userId,
    builder,
    prodApp,
  }: {
    roleId?: string
    userId: string
    builder: boolean
    prodApp: boolean
  }) {
    const appId = prodApp ? this.getProdAppId() : this.getAppId()
    return context.doInAppContext(appId, async () => {
      userId = !userId ? `us_uuid1` : userId
      if (!this.request) {
        throw "Server has not been opened, cannot login."
      }
      // make sure the user exists in the global DB
      if (roleId !== roles.BUILTIN_ROLE_IDS.PUBLIC) {
        const user = await this.globalUser({
          _id: userId,
          builder: { global: builder },
          roles: { [appId]: roleId || roles.BUILTIN_ROLE_IDS.BASIC },
        })
        await sessions.createASession(userId, {
          sessionId: this.sessionIdForUser(userId),
          tenantId: this.getTenantId(),
          email: user.email,
        })
      }
      // have to fake this
      const authObj = {
        userId,
        sessionId: this.sessionIdForUser(userId),
        tenantId: this.getTenantId(),
      }
      const authToken = jwt.sign(authObj, coreEnv.JWT_SECRET as Secret)

      // returning necessary request headers
      await cache.user.invalidateUser(userId)
      return {
        Accept: "application/json",
        Cookie: [`${constants.Cookie.Auth}=${authToken}`],
        [constants.Header.APP_ID]: appId,
        ...this.temporaryHeaders,
      }
    })
  }

  // HEADERS

  // sets the role for the headers, for the period of a callback
  async loginAsRole(roleId: string, cb: () => Promise<unknown>) {
    const roleUser = await this.createUser({
      roles: {
        [this.getProdAppId()]: roleId,
      },
      builder: { global: false },
      admin: { global: false },
    })
    await this.login({
      roleId,
      userId: roleUser._id!,
      builder: false,
      prodApp: true,
    })
    await this.withUser(roleUser, async () => {
      await cb()
    })
  }

  async withHeaders(
    headers: Record<string, string | string[]>,
    cb: () => Promise<unknown>
  ) {
    this.temporaryHeaders = headers
    try {
      await cb()
    } finally {
      this.temporaryHeaders = undefined
    }
  }

  defaultHeaders(extras = {}, prodApp = false) {
    const tenantId = this.getTenantId()
    const user = this.getUser()
    const authObj: AuthToken = {
      userId: user._id!,
      sessionId: this.sessionIdForUser(user._id!),
      tenantId,
    }
    const authToken = jwt.sign(authObj, coreEnv.JWT_SECRET as Secret)

    const headers: any = {
      Accept: "application/json",
      Cookie: [`${constants.Cookie.Auth}=${authToken}`],
      [constants.Header.CSRF_TOKEN]: this.csrfToken,
      Host: this.tenantHost(),
      ...extras,
    }

    if (prodApp) {
      headers[constants.Header.APP_ID] = this.prodAppId
    } else if (this.appId) {
      headers[constants.Header.APP_ID] = this.appId
    }
    return {
      ...headers,
      ...this.temporaryHeaders,
    }
  }

  publicHeaders({ prodApp = true } = {}) {
    const appId = prodApp ? this.prodAppId : this.appId

    const headers: any = {
      Accept: "application/json",
      Cookie: "",
    }
    if (appId) {
      headers[constants.Header.APP_ID] = appId
    }

    headers[constants.Header.TENANT_ID] = this.getTenantId()

    return {
      ...headers,
      ...this.temporaryHeaders,
    }
  }

  async basicRoleHeaders() {
    return await this.roleHeaders({
      email: generator.email({ domain: "example.com" }),
      builder: false,
      prodApp: true,
      roleId: roles.BUILTIN_ROLE_IDS.BASIC,
    })
  }

  async roleHeaders({
    email = generator.email({ domain: "example.com" }),
    roleId = roles.BUILTIN_ROLE_IDS.ADMIN,
    builder = false,
    prodApp = true,
  } = {}) {
    return this.login({ userId: email, roleId, builder, prodApp })
  }

  browserUserAgent() {
    return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
  }

  // TENANCY

  tenantHost() {
    const tenantId = this.getTenantId()
    const platformHost = new URL(coreEnv.PLATFORM_URL).host.split(":")[0]
    return `${tenantId}.${platformHost}`
  }

  getTenantId() {
    if (!this.tenantId) {
      throw new Error("no test tenant id - init has not been called")
    }
    return this.tenantId
  }

  async newTenant(appName = newid()): Promise<App> {
    this.csrfToken = generator.hash()

    this.tenantId = structures.tenant.id()
    this.user = await this.globalUser()
    this.userMetadataId = generateUserMetadataID(this.user._id!)

    return this.createApp(appName)
  }

  doInTenant<T>(task: () => T) {
    return context.doInTenant(this.getTenantId(), task)
  }

  // API

  async generateApiKey(userId?: string) {
    const user = this.getUser()
    if (!userId) {
      userId = user._id!
    }
    const db = tenancy.getTenantDB(this.getTenantId())
    const id = dbCore.generateDevInfoID(userId)
    let devInfo: any
    try {
      devInfo = await db.get(id)
    } catch (err) {
      devInfo = { _id: id, userId }
    }
    devInfo.apiKey = encryption.encrypt(
      `${this.getTenantId()}${dbCore.SEPARATOR}${newid()}`
    )
    await db.put(devInfo)
    return devInfo.apiKey
  }

  // APP
  async createApp(appName: string, url?: string): Promise<App> {
    this.appId = undefined
    this.app = await context.doInTenant(
      this.tenantId!,
      async () =>
        (await this._req(appController.create, {
          name: appName,
          url,
        })) as App
    )
    this.appId = this.app.appId

    return await context.doInAppContext(this.app.appId!, async () => {
      // create production app
      this.prodApp = await this.publish()

      this.allApps.push(this.prodApp)
      this.allApps.push(this.app!)

      return this.app!
    })
  }

  async publish() {
    await this._req(deployController.publishApp)
    // @ts-ignore
    const prodAppId = this.getAppId().replace("_dev", "")
    this.prodAppId = prodAppId

    return context.doInAppContext(prodAppId, async () => {
      const db = context.getProdAppDB()
      return await db.get<App>(dbCore.DocumentType.APP_METADATA)
    })
  }

  async unpublish() {
    const response = await this._req(appController.unpublish, undefined, {
      appId: this.appId,
    })
    this.prodAppId = undefined
    this.prodApp = undefined
    return response
  }

  // TABLE

  async upsertTable(
    config?: TableToBuild,
    { skipReassigning } = { skipReassigning: false }
  ): Promise<Table> {
    config = config || basicTable()
    const response = await this.api.table.save({
      ...config,
      sourceType: config.sourceType || TableSourceType.INTERNAL,
      sourceId: config.sourceId || INTERNAL_TABLE_SOURCE_ID,
    })
    if (!skipReassigning) {
      this.table = response
    }
    return response
  }

  async createTable(
    config?: TableToBuild,
    options = { skipReassigning: false }
  ) {
    if (config != null && config._id) {
      delete config._id
    }
    config = config || basicTable()
    if (!config.sourceId) {
      config.sourceId = INTERNAL_TABLE_SOURCE_ID
    }
    return this.upsertTable(config, options)
  }

  async createExternalTable(
    config?: TableToBuild,
    options = { skipReassigning: false }
  ) {
    if (config != null && config._id) {
      delete config._id
    }
    config = config || basicTable()
    if (this.datasource?._id) {
      config.sourceId = this.datasource._id
      config.sourceType = TableSourceType.EXTERNAL
    }
    return this.upsertTable(config, options)
  }

  async getTable(tableId?: string) {
    tableId = tableId || this.table!._id!
    return this.api.table.get(tableId)
  }

  async createLinkedTable(
    relationshipType = RelationshipType.ONE_TO_MANY,
    links: any = ["link"],
    config?: TableToBuild
  ) {
    if (!this.table) {
      throw "Must have created a table first."
    }
    const tableConfig = config || basicTable()
    if (!tableConfig.sourceId) {
      tableConfig.sourceId = INTERNAL_TABLE_SOURCE_ID
    }
    tableConfig.primaryDisplay = "name"
    for (let link of links) {
      tableConfig.schema[link] = {
        type: FieldType.LINK,
        fieldName: link,
        tableId: this.table._id!,
        name: link,
        relationshipType,
      } as RelationshipFieldMetadata
    }

    if (this.datasource?._id) {
      tableConfig.sourceId = this.datasource._id
      tableConfig.sourceType = TableSourceType.EXTERNAL
    }

    return await this.createTable(tableConfig)
  }

  async createAttachmentTable() {
    const table: any = basicTable()
    table.schema.attachment = {
      type: "attachment",
    }
    return this.createTable(table)
  }

  // ROW

  async createRow(config?: Row): Promise<Row> {
    if (!this.table) {
      throw "Test requires table to be configured."
    }
    const tableId = (config && config.tableId) || this.table._id!
    config = config || basicRow(tableId!)
    return this.api.row.save(tableId, config)
  }

  async getRows(tableId: string) {
    if (!tableId && this.table) {
      tableId = this.table._id!
    }
    return this.api.row.fetch(tableId)
  }

  async searchRows(tableId: string, searchParams?: RowSearchParams) {
    if (!tableId && this.table) {
      tableId = this.table._id!
    }
    return this.api.row.search(tableId, searchParams)
  }

  // ROLE

  async createRole(config?: any) {
    return this._req(roleController.save, config || basicRole())
  }

  // VIEW

  async createLegacyView(config?: View) {
    if (!this.table && !config) {
      throw "Test requires table to be configured."
    }
    const view = config || {
      tableId: this.table!._id,
      name: generator.guid(),
    }
    return this._req(viewController.v1.save, view)
  }

  async createView(
    config?: Omit<CreateViewRequest, "tableId" | "name"> & {
      name?: string
      tableId?: string
    }
  ) {
    if (!this.table && !config?.tableId) {
      throw "Test requires table to be configured."
    }

    const view: CreateViewRequest = {
      ...config,
      tableId: config?.tableId || this.table!._id!,
      name: config?.name || generator.word(),
    }

    return await this.api.viewV2.create(view)
  }

  // AUTOMATION

  async createAutomation(config?: Automation) {
    config = config || basicAutomation()
    if (config._rev) {
      delete config._rev
    }
    const res = await this._req(automationController.create, config)
    this.automation = res.automation
    return this.automation
  }

  async getAllAutomations() {
    return this._req(automationController.fetch)
  }

  async deleteAutomation(automation?: Automation) {
    automation = automation || this.automation
    if (!automation) {
      return
    }
    return this._req(automationController.destroy, undefined, {
      id: automation._id,
      rev: automation._rev,
    })
  }

  async createWebhook(config?: Webhook) {
    if (!this.automation) {
      throw "Must create an automation before creating webhook."
    }
    config = config || basicWebhook(this.automation._id!)

    return (await this._req(webhookController.save, config)).webhook
  }

  // DATASOURCE

  async createDatasource(config?: {
    datasource: Datasource
  }): Promise<WithRequired<Datasource, "_id">> {
    config = config || basicDatasource()
    const response = await this.api.datasource.create(config.datasource)
    this.datasource = response
    return { ...this.datasource, _id: this.datasource!._id! }
  }

  async updateDatasource(
    datasource: Datasource
  ): Promise<WithRequired<Datasource, "_id">> {
    const response = await this.api.datasource.update(datasource)
    this.datasource = response
    return { ...this.datasource, _id: this.datasource!._id! }
  }

  async restDatasource(cfg?: Record<string, any>) {
    return this.createDatasource({
      datasource: {
        ...basicDatasource().datasource,
        source: SourceName.REST,
        config: cfg || {},
      },
    })
  }

  async dynamicVariableDatasource() {
    let datasource = await this.restDatasource()

    const basedOnQuery = await this.createQuery({
      ...basicQuery(datasource._id!),
      fields: {
        path: "www.google.com",
      },
    })
    datasource = await this.updateDatasource({
      ...datasource,
      config: {
        dynamicVariables: [
          {
            queryId: basedOnQuery._id,
            name: "variable3",
            value: "{{ data.0.[value] }}",
          },
        ],
      },
    })
    return { datasource, query: basedOnQuery }
  }

  // AUTOMATION LOG

  async createAutomationLog(automation: Automation, appId?: string) {
    appId = appId || this.getProdAppId()
    return await context.doInAppContext(appId!, async () => {
      return await pro.sdk.automations.logs.storeLog(
        automation,
        basicAutomationResults(automation._id!)
      )
    })
  }

  async getAutomationLogs() {
    return context.doInAppContext(this.getAppId(), async () => {
      const now = new Date()
      return await pro.sdk.automations.logs.logSearch({
        startDate: new Date(now.getTime() - 100000).toISOString(),
      })
    })
  }

  // QUERY

  async createQuery(config?: Query) {
    return this._req(
      queryController.save,
      config || basicQuery(this.getDatasource()._id!)
    )
  }

  // SCREEN

  async createScreen(config?: Screen) {
    config = config || basicScreen()
    return this._req(screenController.save, config)
  }

  // LAYOUT

  async createLayout(config?: Layout) {
    config = config || basicLayout()
    return await this._req(layoutController.save, config)
  }
}

module.exports = TestConfiguration
