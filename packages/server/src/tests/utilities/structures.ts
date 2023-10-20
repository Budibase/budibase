import { permissions, roles, utils } from "@budibase/backend-core"
import { createHomeScreen } from "../../constants/screens"
import { EMPTY_LAYOUT } from "../../constants/layouts"
import { cloneDeep } from "lodash/fp"
import {
  BUILTIN_ACTION_DEFINITIONS,
  TRIGGER_DEFINITIONS,
} from "../../automations"
import {
  Automation,
  AutomationActionStepId,
  AutomationResults,
  AutomationStatus,
  AutomationStep,
  AutomationStepType,
  AutomationTrigger,
  AutomationTriggerStepId,
  Datasource,
  FieldType,
  SourceName,
  Table,
} from "@budibase/types"

export function basicTable(): Table {
  return {
    name: "TestTable",
    type: "table",
    schema: {
      name: {
        type: FieldType.STRING,
        name: "name",
        constraints: {
          type: "string",
        },
      },
      description: {
        type: FieldType.STRING,
        name: "description",
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
  actionDefinition = BUILTIN_ACTION_DEFINITIONS.CREATE_ROW
): AutomationStep {
  return {
    id: utils.newid(),
    ...actionDefinition,
  }
}

export function automationTrigger(
  triggerDefinition = TRIGGER_DEFINITIONS.ROW_SAVED
): AutomationTrigger {
  return {
    id: utils.newid(),
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

export function basicAutomation(appId?: string): Automation {
  return {
    name: "My Automation",
    screenId: "kasdkfldsafkl",
    live: true,
    uiTree: {},
    definition: {
      trigger: {
        stepId: AutomationTriggerStepId.APP,
        name: "test",
        tagline: "test",
        icon: "test",
        description: "test",
        type: AutomationStepType.TRIGGER,
        id: "test",
        inputs: {},
        schema: {
          inputs: {
            properties: {},
          },
          outputs: {
            properties: {},
          },
        },
      },
      steps: [],
    },
    type: "automation",
    appId: appId!,
  }
}

export function loopAutomation(tableId: string, loopOpts?: any): Automation {
  if (!loopOpts) {
    loopOpts = {
      option: "Array",
      binding: "{{ steps.1.rows }}",
    }
  }
  const automation: any = {
    name: "looping",
    type: "automation",
    definition: {
      steps: [
        {
          id: "b",
          type: "ACTION",
          stepId: AutomationActionStepId.QUERY_ROWS,
          internal: true,
          inputs: {
            tableId,
          },
          schema: BUILTIN_ACTION_DEFINITIONS.QUERY_ROWS.schema,
        },
        {
          id: "c",
          type: "ACTION",
          stepId: AutomationActionStepId.LOOP,
          internal: true,
          inputs: loopOpts,
          blockToLoop: "d",
          schema: BUILTIN_ACTION_DEFINITIONS.LOOP.schema,
        },
        {
          id: "d",
          type: "ACTION",
          internal: true,
          stepId: AutomationActionStepId.SERVER_LOG,
          inputs: {
            text: "log statement",
          },
          schema: BUILTIN_ACTION_DEFINITIONS.SERVER_LOG.schema,
        },
      ],
      trigger: {
        id: "a",
        type: "TRIGGER",
        event: "row:save",
        stepId: AutomationTriggerStepId.ROW_SAVED,
        inputs: {
          tableId,
        },
        schema: TRIGGER_DEFINITIONS.ROW_SAVED.schema,
      },
    },
  }
  return automation as Automation
}

export function collectAutomation(tableId?: string): Automation {
  const automation: any = {
    name: "looping",
    type: "automation",
    definition: {
      steps: [
        {
          id: "b",
          type: "ACTION",
          internal: true,
          stepId: AutomationActionStepId.EXECUTE_SCRIPT,
          inputs: {
            code: "return [1,2,3]",
          },
          schema: BUILTIN_ACTION_DEFINITIONS.EXECUTE_SCRIPT.schema,
        },
        {
          id: "c",
          type: "ACTION",
          internal: true,
          stepId: AutomationActionStepId.COLLECT,
          inputs: {
            collection: "{{ literal steps.1.value }}",
          },
          schema: BUILTIN_ACTION_DEFINITIONS.SERVER_LOG.schema,
        },
      ],
      trigger: {
        id: "a",
        type: "TRIGGER",
        event: "row:save",
        stepId: AutomationTriggerStepId.ROW_SAVED,
        inputs: {
          tableId,
        },
        schema: TRIGGER_DEFINITIONS.ROW_SAVED.schema,
      },
    },
  }
  return automation as Automation
}

export function basicAutomationResults(
  automationId: string
): AutomationResults {
  return {
    automationId,
    status: AutomationStatus.SUCCESS,
    trigger: "trigger",
    steps: [
      {
        stepId: AutomationActionStepId.SERVER_LOG,
        inputs: {},
        outputs: {},
      },
    ],
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
    name: `NewRole_${utils.newid()}`,
    inherits: roles.BUILTIN_ROLE_IDS.BASIC,
    permissionId: permissions.BuiltinPermissionID.READ_ONLY,
    version: "name",
  }
}

export function basicDatasource(): { datasource: Datasource } {
  return {
    datasource: {
      type: "datasource",
      name: "Test",
      source: SourceName.POSTGRES,
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

export function basicEnvironmentVariable(
  name: string,
  prod: string,
  dev?: string
) {
  return {
    name,
    production: prod,
    development: dev || prod,
  }
}
