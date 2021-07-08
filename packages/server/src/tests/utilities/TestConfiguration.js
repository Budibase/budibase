const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
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
} = require("./structures")
const controllers = require("./controllers")
const supertest = require("supertest")
const { cleanup } = require("../../utilities/fileSystem")
const { Cookies } = require("@budibase/auth").constants
const { jwt } = require("@budibase/auth").auth
const { StaticDatabases } = require("@budibase/auth/db")
const { createASession } = require("@budibase/auth/sessions")
const { user: userCache } = require("@budibase/auth/cache")
const CouchDB = require("../../db")

const GLOBAL_USER_ID = "us_uuid1"
const EMAIL = "babs@babs.com"
const PASSWORD = "babs_password"

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

  getAppId() {
    return this.appId
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

  async globalUser(id = GLOBAL_USER_ID, builder = true, roles) {
    const db = new CouchDB(StaticDatabases.GLOBAL.name)
    let existing
    try {
      existing = await db.get(id)
    } catch (err) {
      existing = {}
    }
    const user = {
      _id: id,
      ...existing,
      roles: roles || {},
    }
    await createASession(id, "sessionid")
    if (builder) {
      user.builder = { global: true }
    }
    const resp = await db.put(user)
    return {
      _rev: resp._rev,
      ...user,
    }
  }

  async init(appName = "test_application") {
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

  defaultHeaders() {
    const auth = {
      userId: GLOBAL_USER_ID,
      sessionId: "sessionid",
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
    }
    if (this.appId) {
      headers["x-budibase-app-id"] = this.appId
    }
    return headers
  }

  publicHeaders() {
    const headers = {
      Accept: "application/json",
    }
    if (this.appId) {
      headers["x-budibase-app-id"] = this.appId
    }
    return headers
  }

  async roleHeaders({
    email = EMAIL,
    roleId = BUILTIN_ROLE_IDS.ADMIN,
    builder = false,
  }) {
    return this.login(email, PASSWORD, { roleId, builder })
  }

  async createApp(appName) {
    this.app = await this._req({ name: appName }, null, controllers.app.create)
    this.appId = this.app.appId
    this.allApps.push(this.app)
    return this.app
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
    return this._req(null, { id: tableId }, controllers.table.find)
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
    this.datasource = await this._req(config, null, controllers.datasource.save)
    return this.datasource
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

  async createUser(id = null) {
    const globalId = !id ? `us_${Math.random()}` : `us_${id}`
    const resp = await this.globalUser(globalId)
    await userCache.invalidateUser(globalId)
    return {
      ...resp,
      globalId,
    }
  }

  async login(email, password, { roleId, userId, builder } = {}) {
    userId = !userId ? `us_uuid1` : userId
    if (!this.request) {
      throw "Server has not been opened, cannot login."
    }
    // make sure the user exists in the global DB
    if (roleId !== BUILTIN_ROLE_IDS.PUBLIC) {
      const appId = `app${this.getAppId().split("app_dev")[1]}`
      await this.globalUser(userId, builder, {
        [appId]: roleId,
      })
    }
    if (!email || !password) {
      await this.createUser()
    }
    await createASession(userId, "sessionid")
    // have to fake this
    const auth = {
      userId,
      sessionId: "sessionid",
    }
    const app = {
      roleId: roleId,
      appId: this.appId,
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
      "x-budibase-app-id": this.appId,
    }
  }
}

module.exports = TestConfiguration
