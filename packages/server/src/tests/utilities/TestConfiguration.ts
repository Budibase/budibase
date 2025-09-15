import { generator, mocks, structures } from "@budibase/backend-core/tests"

// init the licensing mock
import {
  cache,
  constants,
  context,
  env as coreEnv,
  db as dbCore,
  encryption,
  roles,
  sessions,
  tenancy,
  utils,
} from "@budibase/backend-core"
import * as pro from "@budibase/pro"
import { init as dbInit } from "../../db"
import env from "../../environment"
import {
  app as appController,
  automation as automationController,
  deploy as deployController,
  layout as layoutController,
  query as queryController,
  role as roleController,
  view as viewController,
  webhook as webhookController,
} from "./controllers"
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
  TEST_WORKSPACEAPPID_PLACEHOLDER,
} from "./structures"

import {
  AuthToken,
  Automation,
  CreateViewRequest,
  Datasource,
  DevInfo,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Layout,
  Query,
  RelationshipFieldMetadata,
  RelationshipType,
  Row,
  RowSearchParams,
  Screen,
  SourceName,
  Table,
  TableSourceType,
  User,
  UserCtx,
  View,
  Webhook,
  WithRequired,
  Workspace,
} from "@budibase/types"
import supertest from "supertest"
import { generateUserMetadataID } from "../../db/utils"
import { startup } from "../../startup"
import { cleanup } from "../../utilities/fileSystem"

import { Server } from "http"
import jwt, { Secret } from "jsonwebtoken"
import API from "./api"

const newid = utils.newid

mocks.licenses.init(pro)

// use unlimited license by default
mocks.licenses.useUnlimited()

dbInit()

export interface TableToBuild extends Omit<Table, "sourceId" | "sourceType"> {
  sourceId?: string
  sourceType?: TableSourceType
}

export default class TestConfiguration {
  server?: Server
  request?: supertest.SuperTest<supertest.Test>
  started: boolean
  appId?: string
  defaultWorkspaceAppId?: string
  name?: string
  allWorkspaces: Workspace[]
  app?: Workspace
  prodApp?: Workspace
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
    this.allWorkspaces = []

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

  getDefaultWorkspaceAppId() {
    if (!this.defaultWorkspaceAppId) {
      throw new Error(
        "appId has not been initialised, call config.init() first"
      )
    }
    return this.defaultWorkspaceAppId
  }

  getProdAppId() {
    if (!this.prodAppId) {
      throw new Error(
        "prodAppId has not been initialised, call config.init() first"
      )
    }
    return this.prodAppId
  }

  getUser() {
    if (!this.user) {
      throw new Error("User has not been initialised, call config.init() first")
    }
    return { ...this.user, _id: this.user._id! }
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
      if (context.getWorkspaceId() == null && appId) {
        return context.doInWorkspaceContext(appId, async () => {
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
    if (this.allWorkspaces) {
      cleanup(this.allWorkspaces.map(app => app.appId))
    }
  }

  async withUser<T>(user: User, f: () => Promise<T>): Promise<T> {
    const oldUser = this.user
    this.user = user
    try {
      return await f()
    } finally {
      this.user = oldUser
    }
  }

  async withApp<R>(app: Workspace | string, f: () => Promise<R>) {
    const oldAppId = this.appId
    this.appId = typeof app === "string" ? app : app.appId
    return await context.doInWorkspaceContext(this.appId, async () => {
      try {
        return await f()
      } finally {
        this.appId = oldAppId
      }
    })
  }

  async withProdApp<R>(f: () => Promise<R>) {
    return await this.withApp(this.getProdAppId(), f)
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
      ...user,
      _rev: resp.rev,
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
    return context.doInWorkspaceContext(appId, async () => {
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
          csrfToken: this.csrfToken,
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

  async withHeaders<T>(
    headers: Record<string, string | string[]>,
    cb: () => Promise<T>
  ) {
    this.temporaryHeaders = headers
    try {
      return await cb()
    } finally {
      this.temporaryHeaders = undefined
    }
  }

  defaultHeaders(
    extras: Record<string, string | string[]> = {},
    prodApp = false
  ) {
    const tenantId = this.getTenantId()
    const user = this.getUser()
    const authObj: AuthToken = {
      userId: user._id!,
      sessionId: this.sessionIdForUser(user._id!),
      tenantId,
    }
    const authToken = jwt.sign(authObj, coreEnv.JWT_SECRET as Secret)

    let cookie: (string | string[])[] = [
      `${constants.Cookie.Auth}=${authToken}`,
    ]
    const tempHeaderCookie = this.temporaryHeaders?.["Cookie"]
    let hasAuth = false
    if (Array.isArray(tempHeaderCookie)) {
      hasAuth = !!tempHeaderCookie.find(cookie =>
        cookie.includes(constants.Cookie.Auth)
      )
    } else if (typeof tempHeaderCookie === "string") {
      hasAuth = tempHeaderCookie.includes(constants.Cookie.Auth)
    }
    if (tempHeaderCookie && hasAuth) {
      cookie = [tempHeaderCookie]
    } else if (tempHeaderCookie) {
      cookie.push(tempHeaderCookie)
      delete this.temporaryHeaders?.["Cookie"]
    }
    const headers: any = {
      Accept: "application/json",
      Cookie: cookie,
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

  publicHeaders({
    prodApp = true,
    extras = {},
  }: { prodApp?: boolean; extras?: Record<string, string | string[]> } = {}) {
    const appId = prodApp ? this.prodAppId : this.appId

    const headers: Record<string, string> = {
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
      ...extras,
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

  async newTenant(appName = newid()): Promise<Workspace> {
    this.csrfToken = generator.hash()

    this.tenantId = structures.tenant.id()
    this.user = await this.globalUser()
    this.userMetadataId = generateUserMetadataID(this.user._id!)

    return this.createApp(appName)
  }

  async createDefaultWorkspaceApp(
    appName: string,
    mode: "dev" | "prod" = "dev"
  ) {
    const { workspaceApp } = await this.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: appName,
        url: "/",
      })
    )
    const appId = mode === "dev" ? this.getAppId() : this.getProdAppId()
    const db = dbCore.getDB(appId)
    await db.put({ ...workspaceApp, isDefault: true })

    return { ...workspaceApp, isDefault: true }
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
    const devInfo = await db.tryGet<DevInfo>(id)
    if (devInfo && devInfo.apiKey) {
      return devInfo.apiKey
    }

    const apiKey = encryption.encrypt(
      `${this.getTenantId()}${dbCore.SEPARATOR}${newid()}`
    )
    const newDevInfo: DevInfo = { _id: id, userId, apiKey }
    await db.put(newDevInfo)
    return apiKey
  }

  // APP
  async createApp(appName: string, url?: string): Promise<Workspace> {
    this.appId = undefined
    this.app = await context.doInTenant(
      this.tenantId!,
      async () =>
        (await this._req(appController.create, {
          name: appName,
          url,
        })) as Workspace
    )
    this.appId = this.app.appId

    const defaultWorkspaceApp = await this.createDefaultWorkspaceApp(appName)
    this.defaultWorkspaceAppId = defaultWorkspaceApp?._id

    return await context.doInWorkspaceContext(this.app.appId!, async () => {
      // create production app
      this.prodApp = await this.publish()

      this.allWorkspaces.push(this.prodApp)
      this.allWorkspaces.push(this.app!)

      return this.app!
    })
  }

  async createAppWithOnboarding(
    appName: string,
    url?: string
  ): Promise<Workspace> {
    this.appId = undefined
    this.app = await context.doInTenant(
      this.tenantId!,
      async () =>
        (await this._req(appController.create, {
          name: appName,
          url,
          isOnboarding: "true",
        })) as Workspace
    )
    this.appId = this.app.appId

    const [defaultWorkspaceApp] = (await this.api.workspaceApp.fetch())
      .workspaceApps
    this.defaultWorkspaceAppId = defaultWorkspaceApp?._id

    return await context.doInWorkspaceContext(this.app.appId!, async () => {
      // create production app
      this.prodApp = await this.publish()

      this.allWorkspaces.push(this.prodApp)
      this.allWorkspaces.push(this.app!)

      return this.app!
    })
  }

  async publish() {
    await this._req(deployController.publishApp)
    // @ts-ignore
    const prodAppId = this.getAppId().replace("_dev", "")
    this.prodAppId = prodAppId

    return context.doInWorkspaceContext(prodAppId, async () => {
      const db = context.getProdWorkspaceDB()
      return await db.get<Workspace>(dbCore.DocumentType.WORKSPACE_METADATA)
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
    return await context.doInWorkspaceContext(appId!, async () => {
      return await pro.sdk.automations.logs.storeLog(
        automation,
        basicAutomationResults(automation._id!)
      )
    })
  }

  async getAutomationLogs() {
    return context.doInWorkspaceContext(this.getAppId(), async () => {
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
    if (
      !config.workspaceAppId ||
      config.workspaceAppId === TEST_WORKSPACEAPPID_PLACEHOLDER
    ) {
      config.workspaceAppId = this.getDefaultWorkspaceAppId()
    }

    return this.api.screen.save(config)
  }

  // LAYOUT

  async createLayout(config?: Layout) {
    config = config || basicLayout()
    return await this._req(layoutController.save, config)
  }
}

module.exports = TestConfiguration
