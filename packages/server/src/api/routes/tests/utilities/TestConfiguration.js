const { BUILTIN_ROLE_IDS } = require("../../../../utilities/security/roles")
const env = require("../../../../environment")
const {
  basicTable,
  basicRow,
  basicRole,
  basicAutomation,
  basicDatasource,
  basicQuery,
} = require("./structures")
const controllers = require("./controllers")

const EMAIL = "babs@babs.com"
const PASSWORD = "babs_password"

class TestConfiguration {
  constructor(request) {
    // we need the request for logging in, involves cookies, hard to fake
    this.request = request
    this.appId = null
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

  async init(appName = "test_application") {
    return this.createApp(appName)
  }

  async createApp(appName) {
    this.app = await this._req({ name: appName }, null, controllers.app.create)
    this.appId = this.app._id
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

  async createLinkedTables() {
    const table = await this.createTable()
    table.primaryDisplay = "name"
    table.schema.link = {
      type: "link",
      fieldName: "link",
      tableId: table._id,
    }
    const linkedTable = await this.createTable(table)
    this.table = table
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
    config = config || basicRow(this.table._id)
    return this._req(config, { tableId: this.table._id }, controllers.row.save)
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

  async createUser(
    email = EMAIL,
    password = PASSWORD,
    roleId = BUILTIN_ROLE_IDS.POWER
  ) {
    return this._req(
      {
        email,
        password,
        roleId,
      },
      null,
      controllers.user.create
    )
  }

  async login(email, password) {
    if (!email || !password) {
      await this.createUser()
      email = EMAIL
      password = PASSWORD
    }
    const result = await this.request
      .post(`/api/authenticate`)
      .set({
        "x-budibase-app-id": this.appId,
      })
      .send({ email, password })

    // returning necessary request headers
    return {
      Accept: "application/json",
      Cookie: result.headers["set-cookie"],
    }
  }
}

module.exports = TestConfiguration
