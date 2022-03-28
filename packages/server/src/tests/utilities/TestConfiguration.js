const core = require("@budibase/backend-core")
const CouchDB = require("../../db")
core.init(CouchDB)
const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const env = require("../../environment")
const {
  basicTable,
  basicRow,
  basicRole,
  basicAutomation,
  basicDatasource,
  basicQuery,
  basicScreen,
  basicLayout,
  basicWebhook,
  TENANT_ID,
} = require("./structures")
const controllers = require("./controllers")
const supertest = require("supertest")
const { cleanup } = require("../../utilities/fileSystem")
const { Cookies, Headers } = require("@budibase/backend-core/constants")
const { jwt } = require("@budibase/backend-core/auth")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { createASession } = require("@budibase/backend-core/sessions")
const { user: userCache } = require("@budibase/backend-core/cache")
const newid = require("../../db/newid")
const context = require("@budibase/backend-core/context")
const { generateDevInfoID, SEPARATOR } = require("@budibase/backend-core/db")
const { encrypt } = require("@budibase/backend-core/encryption")

const GLOBAL_USER_ID = "us_uuid1"
const EMAIL = "babs@babs.com"
const CSRF_TOKEN = "e3727778-7af0-4226-b5eb-f43cbe60a306"

class TestConfiguration {
  constructor(openServer = true) {
    if (openServer) {
      // use a random port because it doesn't matter
      env.PORT = 0
      this.server = require("../../app")
      // we need the request for logging in, involves cookies, hard to fake
      this.request = supertest(this.server)
    }
    this.appId = null
    this.allApps = []
  }

  getRequest() {
    return this.request
  }

  getApp() {
    return this.app
  }

  getAppId() {
    return this.appId
  }

  getCouch() {
    return CouchDB
  }

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
    async function run() {
      if (params) {
        request.params = params
      }
      await controlFunc(request)
      return request.body
    }
    // check if already in a context
    if (context.getAppId() == null && this.appId !== null) {
      return context.doInAppContext(this.appId, async () => {
        return run()
      })
    } else {
      return run()
    }
  }

  async generateApiKey(userId = GLOBAL_USER_ID) {
    const db = getGlobalDB(TENANT_ID)
    const id = generateDevInfoID(userId)
    let devInfo
    try {
      devInfo = await db.get(id)
    } catch (err) {
      devInfo = { _id: id, userId }
    }
    devInfo.apiKey = encrypt(`${TENANT_ID}${SEPARATOR}${newid()}`)
    await db.put(devInfo)
    return devInfo.apiKey
  }

  async globalUser({
    id = GLOBAL_USER_ID,
    builder = true,
    email = EMAIL,
    roles,
  } = {}) {
    const db = getGlobalDB(TENANT_ID)
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
      tenantId: TENANT_ID,
    }
    await createASession(id, {
      sessionId: "sessionid",
      tenantId: TENANT_ID,
      csrfToken: CSRF_TOKEN,
    })
    if (builder) {
      user.builder = { global: true }
    } else {
      user.builder = { global: false }
    }
    const resp = await db.put(user)
    return {
      _rev: resp._rev,
      ...user,
    }
  }

  // use a new id as the name to avoid name collisions
  async init(appName = newid()) {
    await this.globalUser()
    return this.createApp(appName)
  }

  end() {
    if (!this) {
      return
    }
    if (this.server) {
      this.server.close()
    }
    cleanup(this.allApps.map(app => app.appId))
  }

  defaultHeaders(extras = {}) {
    const auth = {
      userId: GLOBAL_USER_ID,
      sessionId: "sessionid",
      tenantId: TENANT_ID,
    }
    const app = {
      roleId: BUILTIN_ROLE_IDS.ADMIN,
      appId: this.appId,
    }
    const authToken = jwt.sign(auth, env.JWT_SECRET)
    const appToken = jwt.sign(app, env.JWT_SECRET)
    const headers = {
      Accept: "application/json",
      Cookie: [
        `${Cookies.Auth}=${authToken}`,
        `${Cookies.CurrentApp}=${appToken}`,
      ],
      [Headers.CSRF_TOKEN]: CSRF_TOKEN,
      ...extras,
    }
    if (this.appId) {
      headers[Headers.APP_ID] = this.appId
    }
    return headers
  }

  publicHeaders({ prodApp = true } = {}) {
    const appId = prodApp ? this.prodAppId : this.appId

    const headers = {
      Accept: "application/json",
    }
    if (appId) {
      headers[Headers.APP_ID] = appId
    }
    return headers
  }

  async roleHeaders({
    email = EMAIL,
    roleId = BUILTIN_ROLE_IDS.ADMIN,
    builder = false,
    prodApp = true,
  } = {}) {
    return this.login({ email, roleId, builder, prodApp })
  }

  async createApp(appName) {
    // create dev app
    this.app = await this._req({ name: appName }, null, controllers.app.create)
    this.appId = this.app.appId
    context.updateAppId(this.appId)

    // create production app
    this.prodApp = await this.deploy()
    this.prodAppId = this.prodApp.appId

    this.allApps.push(this.prodApp)
    this.allApps.push(this.app)

    return this.app
  }

  async deploy() {
    await this._req(null, null, controllers.deploy.deployApp)
    const prodAppId = this.getAppId().replace("_dev", "")
    return context.doInAppContext(prodAppId, async () => {
      const appPackage = await this._req(
        null,
        { appId: prodAppId },
        controllers.app.fetchAppPackage
      )
      return appPackage.application
    })
  }

  async updateTable(config = null) {
    config = config || basicTable()
    this.table = await this._req(config, null, controllers.table.save)
    return this.table
  }

  async createTable(config = null) {
    if (config != null && config._id) {
      delete config._id
    }
    return this.updateTable(config)
  }

  async getTable(tableId = null) {
    tableId = tableId || this.table._id
    return this._req(null, { tableId }, controllers.table.find)
  }

  async createLinkedTable(relationshipType = null, links = ["link"]) {
    if (!this.table) {
      throw "Must have created a table first."
    }
    const tableConfig = basicTable()
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
    const table = basicTable()
    table.schema.attachment = {
      type: "attachment",
    }
    return this.createTable(table)
  }

  async createRow(config = null) {
    if (!this.table) {
      throw "Test requires table to be configured."
    }
    const tableId = (config && config.tableId) || this.table._id
    config = config || basicRow(tableId)
    return this._req(config, { tableId }, controllers.row.save)
  }

  async getRow(tableId, rowId) {
    return this._req(null, { tableId, rowId }, controllers.row.find)
  }

  async getRows(tableId) {
    if (!tableId && this.table) {
      tableId = this.table._id
    }
    return this._req(null, { tableId }, controllers.row.fetch)
  }

  async createRole(config = null) {
    config = config || basicRole()
    return this._req(config, null, controllers.role.save)
  }

  async addPermission(roleId, resourceId, level = "read") {
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

  async createView(config) {
    if (!this.table) {
      throw "Test requires table to be configured."
    }
    const view = config || {
      map: "function(doc) { emit(doc[doc.key], doc._id); } ",
      tableId: this.table._id,
      name: "ViewTest",
    }
    return this._req(view, null, controllers.view.save)
  }

  async createAutomation(config) {
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

  async deleteAutomation(automation = null) {
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

  async createDatasource(config = null) {
    config = config || basicDatasource()
    const response = await this._req(config, null, controllers.datasource.save)
    this.datasource = response.datasource
    return this.datasource
  }

  async updateDatasource(datasource) {
    const response = await this._req(
      datasource,
      { datasourceId: datasource._id },
      controllers.datasource.update
    )
    this.datasource = response.datasource
    return this.datasource
  }

  async restDatasource(cfg) {
    return this.createDatasource({
      datasource: {
        ...basicDatasource().datasource,
        source: "REST",
        config: cfg || {},
      },
    })
  }

  async dynamicVariableDatasource() {
    let datasource = await this.restDatasource()
    const basedOnQuery = await this.createQuery({
      ...basicQuery(datasource._id),
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

  async previewQuery(request, config, datasource, fields) {
    return request
      .post(`/api/queries/preview`)
      .send({
        datasourceId: datasource._id,
        parameters: {},
        fields,
        queryVerb: "read",
        name: datasource.name,
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }

  async createQuery(config = null) {
    if (!this.datasource && !config) {
      throw "No data source created for query."
    }
    config = config || basicQuery(this.datasource._id)
    return this._req(config, null, controllers.query.save)
  }

  async createScreen(config = null) {
    config = config || basicScreen()
    return this._req(config, null, controllers.screen.save)
  }

  async createWebhook(config = null) {
    if (!this.automation) {
      throw "Must create an automation before creating webhook."
    }
    config = config || basicWebhook(this.automation._id)
    return (await this._req(config, null, controllers.webhook.save)).webhook
  }

  async createLayout(config = null) {
    config = config || basicLayout()
    return await this._req(config, null, controllers.layout.save)
  }

  async createUser(id = null, email = EMAIL) {
    const globalId = !id ? `us_${Math.random()}` : `us_${id}`
    const resp = await this.globalUser({ id: globalId, email })
    await userCache.invalidateUser(globalId)
    return {
      ...resp,
      globalId,
    }
  }

  async login({ roleId, userId, builder, prodApp = false } = {}) {
    const appId = prodApp ? this.prodAppId : this.appId
    return context.doInAppContext(appId, async () => {
      userId = !userId ? `us_uuid1` : userId
      if (!this.request) {
        throw "Server has not been opened, cannot login."
      }
      // make sure the user exists in the global DB
      if (roleId !== BUILTIN_ROLE_IDS.PUBLIC) {
        await this.globalUser({
          id: userId,
          builder,
          roles: { [this.prodAppId]: roleId },
        })
      }
      await createASession(userId, {
        sessionId: "sessionid",
        tenantId: TENANT_ID,
      })
      // have to fake this
      const auth = {
        userId,
        sessionId: "sessionid",
        tenantId: TENANT_ID,
      }
      const app = {
        roleId: roleId,
        appId,
      }
      const authToken = jwt.sign(auth, env.JWT_SECRET)
      const appToken = jwt.sign(app, env.JWT_SECRET)

      // returning necessary request headers
      await userCache.invalidateUser(userId)
      return {
        Accept: "application/json",
        Cookie: [
          `${Cookies.Auth}=${authToken}`,
          `${Cookies.CurrentApp}=${appToken}`,
        ],
        [Headers.APP_ID]: appId,
      }
    })
  }
}

module.exports = TestConfiguration
