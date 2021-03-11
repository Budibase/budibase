const { BUILTIN_ROLE_IDS } = require("../../../../utilities/security/roles")
const {
  BUILTIN_PERMISSION_IDS,
} = require("../../../../utilities/security/permissions")
const { createHomeScreen } = require("../../../../constants/screens")
const { EMPTY_LAYOUT } = require("../../../../constants/layouts")
const { cloneDeep } = require("lodash/fp")

exports.basicTable = () => {
  return {
    name: "TestTable",
    type: "table",
    key: "name",
    schema: {
      name: {
        type: "string",
        constraints: {
          type: "string",
        },
      },
      description: {
        type: "string",
        constraints: {
          type: "string",
        },
      },
    },
  }
}

exports.basicAutomation = () => {
  return {
    name: "My Automation",
    screenId: "kasdkfldsafkl",
    live: true,
    uiTree: {},
    definition: {
      trigger: {
        inputs: {},
      },
      steps: [],
    },
    type: "automation",
  }
}

exports.basicRow = tableId => {
  return {
    name: "Test Contact",
    description: "original description",
    status: "new",
    tableId: tableId,
  }
}

exports.basicRole = () => {
  return {
    name: "NewRole",
    inherits: BUILTIN_ROLE_IDS.BASIC,
    permissionId: BUILTIN_PERMISSION_IDS.READ_ONLY,
  }
}

exports.basicDatasource = () => {
  return {
    type: "datasource",
    name: "Test",
    source: "POSTGRES",
    config: {},
  }
}

exports.basicQuery = datasourceId => {
  return {
    datasourceId: datasourceId,
    name: "New Query",
    parameters: [],
    fields: {},
    schema: {},
    queryVerb: "read",
  }
}

exports.basicUser = role => {
  return {
    email: "bill@bill.com",
    password: "yeeooo",
    roleId: role,
  }
}

exports.basicScreen = () => {
  return createHomeScreen()
}

exports.basicLayout = () => {
  return cloneDeep(EMPTY_LAYOUT)
}

exports.basicWebhook = automationId => {
  return {
    live: true,
    name: "webhook",
    action: {
      type: "automation",
      target: automationId,
    },
  }
}
