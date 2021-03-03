const { BUILTIN_ROLE_IDS } = require("../../../../utilities/security/roles")
const {
  BUILTIN_PERMISSION_IDS,
} = require("../../../../utilities/security/permissions")

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
