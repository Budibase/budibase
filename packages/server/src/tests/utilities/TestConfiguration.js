const { BUILTIN_ROLE_IDS } = require("../../utilities/security/roles")
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
const { StaticDatabases } = require("@budibase/auth").db
const CouchDB = require("../../db")

const GLOBAL_USER_ID = "us_uuid1"
const EMAIL = "babs@babs.com"
const PASSWORD = "babs_password"

class TestConfiguration {
  constructor(openServer = true) {
    if (openServer) {
      env.PORT = 4002
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
    request.request = {
      body: config,
    }
    if (params) {
      request.params = params
    }
    await controlFunc(request)
    return request.body
  }

  async globalUser(id = GLOBAL_USER_ID, builder = true) {
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
      roles: {},
    }
    if (builder) {
      user.builder = { global: true }
    }
    await db.put(user)
  }

  async init(appName = "test_application") {
    await this.globalUser()
    return this.createApp(appName)
  }

  end() {
    if (this.server) {
      this.server.close()
    }
    cleanup(this.allApps.map(app => app._id))
  }

  defaultHeaders() {
    const auth = {
      userId: GLOBAL_USER_ID,
    }
    const app = {
      roleId: BUILTIN_ROLE_IDS.BUILDER,
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
    let user
    try {
      user = await this.createUser(email, PASSWORD, roleId)
    } catch (err) {
      // allow errors here
    }
    return this.login(email, PASSWORD, { roleId, userId: user._id, builder })
  }

  async createApp(appName) {
    this.app = await this._req({ name: appName }, null, controllers.app.create)
    this.appId = this.app._id
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
    return this._req(null, { tableId }, controllers.row.fetchTableRows)
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

  async createUser(
    email = EMAIL,
    password = PASSWORD,
    roleId = BUILTIN_ROLE_IDS.POWER
  ) {
    const globalId = `us_${Math.random()}`
    await this.globalUser(globalId, roleId === BUILTIN_ROLE_IDS.BUILDER)
    const user = await this._req(
      {
        email,
        password,
        roleId,
      },
      null,
      controllers.user.createMetadata
    )
    return {
      ...user,
      globalId,
    }
  }

  async login(email, password, { roleId, userId, builder } = {}) {
    roleId = !roleId ? BUILTIN_ROLE_IDS.BUILDER : roleId
    userId = !userId ? `us_uuid1` : userId
    if (!this.request) {
      throw "Server has not been opened, cannot login."
    }
    // make sure the user exists in the global DB
    if (roleId !== BUILTIN_ROLE_IDS.PUBLIC) {
      await this.globalUser(userId, builder)
    }
    if (!email || !password) {
      await this.createUser()
    }
    // have to fake this
    const auth = {
      userId,
    }
    const app = {
      roleId: roleId,
      appId: this.appId,
    }
    const authToken = jwt.sign(auth, env.JWT_SECRET)
    const appToken = jwt.sign(app, env.JWT_SECRET)

    // returning necessary request headers
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
