const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const { BUILTIN_PERMISSION_IDS } = require("@budibase/backend-core/permissions")
const { createHomeScreen } = require("../../constants/screens")
const { EMPTY_LAYOUT } = require("../../constants/layouts")
const { cloneDeep } = require("lodash/fp")
const { v4: uuidv4 } = require("uuid")
const { TRIGGER_DEFINITIONS, ACTION_DEFINITIONS } = require("../../automations")

exports.TENANT_ID = "default"

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

exports.basicView = tableId => {
  return {
    tableId,
    name: "ViewTest",
  }
}

exports.filterView = tableId => {
  return {
    ...this.basicView(tableId),
    filters: [
      {
        value: 0,
        condition: "MT",
        key: "count",
      },
    ],
  }
}

exports.calculationView = tableId => {
  return {
    ...this.basicView(tableId),
    field: "count",
    calculation: "sum",
  }
}

exports.view = tableId => {
  return {
    ...this.filterView(tableId),
    ...this.calculationView(tableId),
  }
}

exports.automationStep = (actionDefinition = ACTION_DEFINITIONS.CREATE_ROW) => {
  return {
    id: uuidv4(),
    ...actionDefinition,
  }
}

exports.automationTrigger = (
  triggerDefinition = TRIGGER_DEFINITIONS.ROW_SAVED
) => {
  return {
    id: uuidv4(),
    ...triggerDefinition,
  }
}

exports.newAutomation = ({ steps, trigger } = {}) => {
  const automation = exports.basicAutomation()

  if (trigger) {
    automation.definition.trigger = trigger
  } else {
    automation.definition.trigger = exports.automationTrigger()
  }

  if (steps) {
    automation.definition.steps = steps
  } else {
    automation.definition.steps = [exports.automationStep()]
  }

  return automation
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
    tableId: tableId,
  }
}

exports.basicLinkedRow = (tableId, linkedRowId, linkField = "link") => {
  // this is based on the basic linked tables you get from the test configuration
  return {
    ...exports.basicRow(tableId),
    [linkField]: [linkedRowId],
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
    datasource: {
      type: "datasource",
      name: "Test",
      source: "POSTGRES",
      config: {},
    },
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
