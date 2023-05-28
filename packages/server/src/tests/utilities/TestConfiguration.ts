import { generator, mocks, structures } from "@budibase/backend-core/tests"

// init the licensing mock
import * as pro from "@budibase/pro"
mocks.licenses.init(pro)

// use unlimited license by default
mocks.licenses.useUnlimited()

import { init as dbInit } from "../../db"
dbInit()
import env from "../../environment"
import { env as coreEnv } from "@budibase/backend-core"
import {
  basicTable,
  basicRow,
  basicRole,
  basicAutomation,
  basicDatasource,
  basicQuery,
  basicScreen,
  basicLayout,
  basicWebhook,
} from "./structures"
import {
  constants,
  tenancy,
  sessions,
  cache,
  context,
  db as dbCore,
  encryption,
  auth,
  roles,
} from "@budibase/backend-core"
import * as controllers from "./controllers"
import { cleanup } from "../../utilities/fileSystem"
import newid from "../../db/newid"
import { generateUserMetadataID } from "../../db/utils"
import { startup } from "../../startup"
import supertest from "supertest"
import {
  App,
  AuthToken,
  Datasource,
  Row,
  SourceName,
  Table,
  SearchFilters,
  UserRoles,
} from "@budibase/types"
import { BUILTIN_ROLE_IDS } from "@budibase/backend-core/src/security/roles"

type DefaultUserValues = {
  globalUserId: string
  email: string
  firstName: string
  lastName: string
  csrfToken: string
}

class TestConfiguration {
  server: any
  request: supertest.SuperTest<supertest.Test> | undefined
  started: boolean
  appId: string | null
  allApps: any[]
  app?: App
  prodApp: any
  prodAppId: any
  user: any
  globalUserId: any
  userMetadataId: any
  table: any
  linkedTable: any
  automation: any
  datasource: any
  tenantId?: string
  defaultUserValues: DefaultUserValues

  constructor(openServer = true) {
    if (openServer) {
      // use a random port because it doesn't matter
      env.PORT = "0"
      this.server = require("../../app").default
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
      this.started = true
    } else {
      this.started = false
    }
    this.appId = null
    this.allApps = []
    this.defaultUserValues = this.populateDefaultUserValues()
  }

  populateDefaultUserValues(): DefaultUserValues {
    return {
      globalUserId: `us_${newid()}`,
      email: generator.email(),
      firstName: generator.first(),
      lastName: generator.last(),
      csrfToken: generator.hash(),
    }
  }

  getRequest() {
    return this.request
  }

  getApp() {
    return this.app
  }

  getProdApp() {
    return this.prodApp
  }

  getAppId() {
    return this.appId
  }

  getProdAppId() {
    return this.prodAppId
  }

  getUserDetails() {
    return {
      globalId: this.defaultUserValues.globalUserId,
      email: this.defaultUserValues.email,
      firstName: this.defaultUserValues.firstName,
      lastName: this.defaultUserValues.lastName,
    }
  }

  async doInContext(appId: string | null, task: any) {
    if (!appId) {
      appId = this.appId
    }

    const tenant = this.getTenantId()
    return tenancy.doInTenant(tenant, () => {
      // check if already in a context
      if (context.getAppId() == null && appId !== null) {
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
      require("../../app").default.close()
    }
    if (this.allApps) {
      cleanup(this.allApps.map(app => app.appId))
    }
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

  setGoogleAuth = (value: string) => {
    env._set("GOOGLE_CLIENT_ID", value)
    env._set("GOOGLE_CLIENT_SECRET", value)
    coreEnv._set("GOOGLE_CLIENT_ID", value)
    coreEnv._set("GOOGLE_CLIENT_SECRET", value)
  }

  modeCloud = () => {
    this.setSelfHosted(false)
  }

  modeSelf = () => {
    this.setSelfHosted(true)
  }

  // UTILS

  _req(body: any, params: any, controlFunc: any) {
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
    return this.doInContext(appId, async () => {
      await controlFunc(request)
      return request.body
    })
  }

  // USER / AUTH
  async globalUser({
    id = this.defaultUserValues.globalUserId,
    firstName = this.defaultUserValues.firstName,
    lastName = this.defaultUserValues.lastName,
    builder = true,
    admin = false,
    email = this.defaultUserValues.email,
    roles,
  }: any = {}) {
    const db = tenancy.getTenantDB(this.getTenantId())
    let existing
    try {
      existing = await db.get(id)
    } catch (err) {
      existing = { email }
    }
    const user = {
      _id: id,
      ...existing,
      roles: roles || {},
      tenantId: this.getTenantId(),
      firstName,
      lastName,
    }
    await sessions.createASession(id, {
      sessionId: "sessionid",
      tenantId: this.getTenantId(),
      csrfToken: this.defaultUserValues.csrfToken,
    })
    if (builder) {
      user.builder = { global: true }
    } else {
      user.builder = { global: false }
    }
    if (admin) {
      user.admin = { global: true }
    } else {
      user.admin = { global: false }
    }
    const resp = await db.put(user)
    return {
      _rev: resp.rev,
      ...user,
    }
  }

  async createUser(
    user: {
      id?: string
      firstName?: string
      lastName?: string
      email?: string
      builder?: boolean
      admin?: boolean
      roles?: UserRoles
    } = {}
  ) {
    let { id, firstName, lastName, email, builder, admin, roles } = user
    firstName = firstName || this.defaultUserValues.firstName
    lastName = lastName || this.defaultUserValues.lastName
    email = email || this.defaultUserValues.email
    roles = roles || {}
    if (builder == null) {
      builder = true
    }
    const globalId = !id ? `us_${Math.random()}` : `us_${id}`
    const resp = await this.globalUser({
      id: globalId,
      firstName,
      lastName,
      email,
      builder,
      admin,
      roles,
    })
    await cache.user.invalidateUser(globalId)
    return {
      ...resp,
      globalId,
    }
  }

  async createGroup(roleId: string = BUILTIN_ROLE_IDS.BASIC) {
    return context.doInTenant(this.tenantId!, async () => {
      const baseGroup = structures.userGroups.userGroup()
      baseGroup.roles = {
        [this.prodAppId]: roleId,
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

  async login({ roleId, userId, builder, prodApp = false }: any = {}) {
    const appId = prodApp ? this.prodAppId : this.appId
    return context.doInAppContext(appId, async () => {
      userId = !userId ? `us_uuid1` : userId
      if (!this.request) {
        throw "Server has not been opened, cannot login."
      }
      // make sure the user exists in the global DB
      if (roleId !== roles.BUILTIN_ROLE_IDS.PUBLIC) {
        await this.globalUser({
          id: userId,
          builder,
          roles: { [this.prodAppId]: roleId },
        })
      }
      await sessions.createASession(userId, {
        sessionId: "sessionid",
        tenantId: this.getTenantId(),
      })
      // have to fake this
      const authObj = {
        userId,
        sessionId: "sessionid",
        tenantId: this.getTenantId(),
      }
      const authToken = auth.jwt.sign(authObj, coreEnv.JWT_SECRET)

      // returning necessary request headers
      await cache.user.invalidateUser(userId)
      return {
        Accept: "application/json",
        Cookie: [`${constants.Cookie.Auth}=${authToken}`],
        [constants.Header.APP_ID]: appId,
      }
    })
  }

  // HEADERS

  defaultHeaders(extras = {}, prodApp = false) {
    const tenantId = this.getTenantId()
    const authObj: AuthToken = {
      userId: this.defaultUserValues.globalUserId,
      sessionId: "sessionid",
      tenantId,
    }
    const authToken = auth.jwt.sign(authObj, coreEnv.JWT_SECRET)

    const headers: any = {
      Accept: "application/json",
      Cookie: [`${constants.Cookie.Auth}=${authToken}`],
      [constants.Header.CSRF_TOKEN]: this.defaultUserValues.csrfToken,
      Host: this.tenantHost(),
      ...extras,
    }

    if (prodApp) {
      headers[constants.Header.APP_ID] = this.prodAppId
    } else if (this.appId) {
      headers[constants.Header.APP_ID] = this.appId
    }
    return headers
  }

  publicHeaders({ prodApp = true } = {}) {
    const appId = prodApp ? this.prodAppId : this.appId

    const headers: any = {
      Accept: "application/json",
    }
    if (appId) {
      headers[constants.Header.APP_ID] = appId
    }

    headers[constants.Header.TENANT_ID] = this.getTenantId()

    return headers
  }

  async roleHeaders({
    email = this.defaultUserValues.email,
    roleId = roles.BUILTIN_ROLE_IDS.ADMIN,
    builder = false,
    prodApp = true,
  } = {}) {
    return this.login({ email, roleId, builder, prodApp })
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
    this.defaultUserValues = this.populateDefaultUserValues()
    this.tenantId = structures.tenant.id()
    this.user = await this.globalUser()
    this.globalUserId = this.user._id
    this.userMetadataId = generateUserMetadataID(this.globalUserId)
    return this.createApp(appName)
  }

  doInTenant(task: any) {
    return context.doInTenant(this.getTenantId(), task)
  }

  // API

  async generateApiKey(userId = this.defaultUserValues.globalUserId) {
    const db = tenancy.getTenantDB(this.getTenantId())
    const id = dbCore.generateDevInfoID(userId)
    let devInfo
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
  async createApp(appName: string): Promise<App> {
    // create dev app
    // clear any old app
    this.appId = null
    await context.doInAppContext(null, async () => {
      this.app = await this._req(
        { name: appName },
        null,
        controllers.app.create
      )
      this.appId = this.app?.appId!
    })
    return await context.doInAppContext(this.appId, async () => {
      // create production app
      this.prodApp = await this.publish()

      this.allApps.push(this.prodApp)
      this.allApps.push(this.app)

      return this.app
    })
  }

  async publish() {
    await this._req(null, null, controllers.deploy.publishApp)
    // @ts-ignore
    const prodAppId = this.getAppId().replace("_dev", "")
    this.prodAppId = prodAppId

    return context.doInAppContext(prodAppId, async () => {
      const db = context.getProdAppDB()
      return await db.get(dbCore.DocumentType.APP_METADATA)
    })
  }

  async unpublish() {
    const response = await this._req(
      null,
      { appId: this.appId },
      controllers.app.unpublish
    )
    this.prodAppId = null
    this.prodApp = null
    return response
  }

  // TABLE

  async updateTable(config?: any): Promise<Table> {
    config = config || basicTable()
    this.table = await this._req(config, null, controllers.table.save)
    return this.table
  }

  async createTable(config?: Table) {
    if (config != null && config._id) {
      delete config._id
    }
    return this.updateTable(config)
  }

  async getTable(tableId?: string) {
    tableId = tableId || this.table._id
    return this._req(null, { tableId }, controllers.table.find)
  }

  async createLinkedTable(relationshipType?: string, links: any = ["link"]) {
    if (!this.table) {
      throw "Must have created a table first."
    }
    const tableConfig: any = basicTable()
    tableConfig.primaryDisplay = "name"
    for (let link of links) {
      tableConfig.schema[link] = {
        type: "link",
        fieldName: link,
        tableId: this.table._id,
        name: link,
      }
      if (relationshipType) {
        tableConfig.schema[link].relationshipType = relationshipType
      }
    }
    const linkedTable = await this.createTable(tableConfig)
    this.linkedTable = linkedTable
    return linkedTable
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
    const tableId = (config && config.tableId) || this.table._id
    config = config || basicRow(tableId)
    return this._req(config, { tableId }, controllers.row.save)
  }

  async getRow(tableId: string, rowId: string): Promise<Row> {
    return this._req(null, { tableId, rowId }, controllers.row.find)
  }

  async getRows(tableId: string) {
    if (!tableId && this.table) {
      tableId = this.table._id
    }
    return this._req(null, { tableId }, controllers.row.fetch)
  }

  async searchRows(tableId: string, searchParams: SearchFilters = {}) {
    if (!tableId && this.table) {
      tableId = this.table._id
    }
    const body = {
      query: searchParams,
    }
    return this._req(body, { tableId }, controllers.row.search)
  }

  // ROLE

  async createRole(config?: any) {
    config = config || basicRole()
    return this._req(config, null, controllers.role.save)
  }

  async addPermission(roleId: string, resourceId: string, level = "read") {
    return this._req(
      null,
      {
        roleId,
        resourceId,
        level,
      },
      controllers.perms.addPermission
    )
  }

  // VIEW

  async createView(config?: any) {
    if (!this.table) {
      throw "Test requires table to be configured."
    }
    const view = config || {
      tableId: this.table._id,
      name: "ViewTest",
    }
    return this._req(view, null, controllers.view.save)
  }

  // AUTOMATION

  async createAutomation(config?: any) {
    config = config || basicAutomation()
    if (config._rev) {
      delete config._rev
    }
    this.automation = (
      await this._req(config, null, controllers.automation.create)
    ).automation
    return this.automation
  }

  async getAllAutomations() {
    return this._req(null, null, controllers.automation.fetch)
  }

  async deleteAutomation(automation?: any) {
    automation = automation || this.automation
    if (!automation) {
      return
    }
    return this._req(
      null,
      { id: automation._id, rev: automation._rev },
      controllers.automation.destroy
    )
  }

  async createWebhook(config?: any) {
    if (!this.automation) {
      throw "Must create an automation before creating webhook."
    }
    config = config || basicWebhook(this.automation._id)
    return (await this._req(config, null, controllers.webhook.save)).webhook
  }

  // DATASOURCE

  async createDatasource(config?: {
    datasource: Datasource
  }): Promise<Datasource> {
    config = config || basicDatasource()
    const response = await this._req(config, null, controllers.datasource.save)
    this.datasource = response.datasource
    return this.datasource
  }

  async updateDatasource(datasource: any) {
    const response = await this._req(
      datasource,
      { datasourceId: datasource._id },
      controllers.datasource.update
    )
    this.datasource = response.datasource
    return this.datasource
  }

  async restDatasource(cfg?: any) {
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

  // QUERY

  async previewQuery(
    request: any,
    config: any,
    datasource: any,
    fields: any,
    params: any,
    verb?: string
  ) {
    return request
      .post(`/api/queries/preview`)
      .send({
        datasourceId: datasource._id,
        parameters: params || {},
        fields,
        queryVerb: verb || "read",
        name: datasource.name,
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  async createQuery(config?: any) {
    if (!this.datasource && !config) {
      throw "No datasource created for query."
    }
    config = config || basicQuery(this.datasource._id)
    return this._req(config, null, controllers.query.save)
  }

  // SCREEN

  async createScreen(config?: any) {
    config = config || basicScreen()
    return this._req(config, null, controllers.screen.save)
  }

  // LAYOUT

  async createLayout(config?: any) {
    config = config || basicLayout()
    return await this._req(config, null, controllers.layout.save)
  }
}

export = TestConfiguration
