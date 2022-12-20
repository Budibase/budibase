import { roles, permissions } from "@budibase/backend-core"
import { createHomeScreen } from "../../constants/screens"
import { EMPTY_LAYOUT } from "../../constants/layouts"
import { cloneDeep } from "lodash/fp"
import { TRIGGER_DEFINITIONS, ACTION_DEFINITIONS } from "../../automations"
const { v4: uuidv4 } = require("uuid")

export const TENANT_ID = "default"

export function basicTable() {
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

export function basicView(tableId: string) {
  return {
    tableId,
    name: "ViewTest",
  }
}

export function filterView(tableId: string) {
  return {
    ...basicView(tableId),
    filters: [
      {
        value: 0,
        condition: "MT",
        key: "count",
      },
    ],
  }
}

export function calculationView(tableId: string) {
  return {
    ...basicView(tableId),
    field: "count",
    calculation: "sum",
  }
}

export function view(tableId: string) {
  return {
    ...filterView(tableId),
    ...calculationView(tableId),
  }
}

export function automationStep(
  actionDefinition = ACTION_DEFINITIONS.CREATE_ROW
) {
  return {
    id: uuidv4(),
    ...actionDefinition,
  }
}

export function automationTrigger(
  triggerDefinition = TRIGGER_DEFINITIONS.ROW_SAVED
) {
  return {
    id: uuidv4(),
    ...triggerDefinition,
  }
}

export function newAutomation({ steps, trigger }: any = {}) {
  const automation: any = basicAutomation()

  if (trigger) {
    automation.definition.trigger = trigger
  } else {
    automation.definition.trigger = automationTrigger()
  }

  if (steps) {
    automation.definition.steps = steps
  } else {
    automation.definition.steps = [automationStep()]
  }

  return automation
}

export function basicAutomation() {
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

export function basicRow(tableId: string) {
  return {
    name: "Test Contact",
    description: "original description",
    tableId: tableId,
  }
}

export function basicLinkedRow(
  tableId: string,
  linkedRowId: string,
  linkField: string = "link"
) {
  // this is based on the basic linked tables you get from the test configuration
  return {
    ...basicRow(tableId),
    [linkField]: [linkedRowId],
  }
}

export function basicRole() {
  return {
    name: "NewRole",
    inherits: roles.BUILTIN_ROLE_IDS.BASIC,
    permissionId: permissions.BuiltinPermissionID.READ_ONLY,
  }
}

export function basicDatasource() {
  return {
    datasource: {
      type: "datasource",
      name: "Test",
      source: "POSTGRES",
      config: {},
    },
  }
}

export function basicQuery(datasourceId: string) {
  return {
    datasourceId: datasourceId,
    name: "New Query",
    parameters: [],
    fields: {},
    schema: {},
    queryVerb: "read",
  }
}

export function basicUser(role: string) {
  return {
    email: "bill@bill.com",
    password: "yeeooo",
    roleId: role,
  }
}

export function basicScreen() {
  return createHomeScreen()
}

export function basicLayout() {
  return cloneDeep(EMPTY_LAYOUT)
}

export function basicWebhook(automationId: string) {
  return {
    live: true,
    name: "webhook",
    action: {
      type: "automation",
      target: automationId,
    },
  }
}
