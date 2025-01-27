import { roles, utils } from "@budibase/backend-core"
import { createHomeScreen } from "../../constants/screens"
import { EMPTY_LAYOUT } from "../../constants/layouts"
import { cloneDeep } from "lodash/fp"
import {
  BUILTIN_ACTION_DEFINITIONS,
  TRIGGER_DEFINITIONS,
} from "../../automations"
import {
  AIOperationEnum,
  AutoFieldSubType,
  Automation,
  AutomationActionStepId,
  AutomationEventType,
  AutomationResults,
  AutomationStatus,
  AutomationStep,
  AutomationStepType,
  AutomationTrigger,
  AutomationTriggerStepId,
  BBReferenceFieldSubType,
  CreateViewRequest,
  Datasource,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  JsonFieldSubType,
  LoopStepType,
  Query,
  Role,
  SourceName,
  Table,
  TableSourceType,
  Webhook,
  WebhookActionType,
  BuiltinPermissionID,
} from "@budibase/types"
import { LoopInput } from "../../definitions/automations"
import { merge } from "lodash"
import { generator } from "@budibase/backend-core/tests"

const { BUILTIN_ROLE_IDS } = roles

export function tableForDatasource(
  datasource?: Datasource,
  ...extra: Partial<Table>[]
): Table {
  return merge(
    {
      name: generator.guid().substring(0, 10),
      type: "table",
      sourceType: datasource
        ? TableSourceType.EXTERNAL
        : TableSourceType.INTERNAL,
      sourceId: datasource ? datasource._id! : INTERNAL_TABLE_SOURCE_ID,
      schema: {},
    },
    ...extra
  )
}

export function basicTable(
  datasource?: Datasource,
  ...extra: Partial<Table>[]
): Table {
  return tableForDatasource(
    datasource,
    {
      name: "TestTable",
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
    },
    ...extra
  )
}

export function basicTableWithAttachmentField(
  datasource?: Datasource,
  ...extra: Partial<Table>[]
): Table {
  return tableForDatasource(
    datasource,
    {
      name: "TestTable",
      schema: {
        file_attachment: {
          type: FieldType.ATTACHMENTS,
          name: "description",
          constraints: {
            type: "array",
          },
        },
        single_file_attachment: {
          type: FieldType.ATTACHMENT_SINGLE,
          name: "description",
        },
      },
    },
    ...extra
  )
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

function viewV2CreateRequest(tableId: string): CreateViewRequest {
  return {
    tableId,
    name: generator.guid(),
  }
}

export const viewV2 = {
  createRequest: viewV2CreateRequest,
}

export function automationStep(
  actionDefinition = BUILTIN_ACTION_DEFINITIONS.CREATE_ROW
): AutomationStep {
  return {
    id: utils.newid(),
    ...actionDefinition,
    stepId: AutomationActionStepId.CREATE_ROW,
    inputs: { row: {} },
  }
}

export function automationTrigger(
  triggerDefinition = TRIGGER_DEFINITIONS.ROW_SAVED
): AutomationTrigger {
  return {
    id: utils.newid(),
    ...triggerDefinition,
  } as AutomationTrigger
}

export function newAutomation({
  steps,
  trigger,
}: { steps?: AutomationStep[]; trigger?: AutomationTrigger } = {}) {
  const automation = basicAutomation()

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

export function rowActionAutomation() {
  const automation = newAutomation({
    trigger: {
      ...automationTrigger(),
      stepId: AutomationTriggerStepId.ROW_ACTION,
    },
  })
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
        inputs: {
          fields: {},
        },
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

export function basicCronAutomation(appId: string, cron: string): Automation {
  const automation: Automation = {
    name: `Automation ${generator.guid()}`,
    definition: {
      trigger: {
        stepId: AutomationTriggerStepId.CRON,
        name: "test",
        tagline: "test",
        icon: "test",
        description: "test",
        type: AutomationStepType.TRIGGER,
        id: "test",
        inputs: {
          cron,
        },
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
    appId,
  }
  return automation
}

export function serverLogAutomation(appId?: string): Automation {
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
        inputs: { fields: {} },
        schema: {
          inputs: {
            properties: {},
          },
          outputs: {
            properties: {},
          },
        },
      },
      steps: [
        {
          stepId: AutomationActionStepId.SERVER_LOG,
          name: "Backend log",
          tagline: "Console log a value in the backend",
          icon: "Monitoring",
          description: "Logs the given text to the server (using console.log)",
          internal: true,
          features: {
            LOOPING: true,
          },
          inputs: {
            text: "log statement",
          },
          schema: BUILTIN_ACTION_DEFINITIONS.SERVER_LOG.schema,
          id: "y8lkZbeSe",
          type: AutomationStepType.ACTION,
        },
      ],
    },
    type: "automation",
    appId: appId!,
  }
}

export function loopAutomation(
  tableId: string,
  loopOpts?: LoopInput
): Automation {
  if (!loopOpts) {
    loopOpts = {
      option: LoopStepType.ARRAY,
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
        event: AutomationEventType.ROW_SAVE,
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
        event: AutomationEventType.ROW_SAVE,
        stepId: AutomationTriggerStepId.ROW_SAVED,
        inputs: {
          tableId,
        },
        schema: TRIGGER_DEFINITIONS.ROW_SAVED.schema,
      },
    },
  }
  return automation
}

export function filterAutomation(appId: string, tableId?: string): Automation {
  const automation: Automation = {
    name: "looping",
    type: "automation",
    appId,
    definition: {
      steps: [
        {
          name: "Filter Step",
          tagline: "An automation filter step",
          description: "A filter automation",
          id: "b",
          icon: "Icon",
          type: AutomationStepType.ACTION,
          internal: true,
          stepId: AutomationActionStepId.FILTER,
          inputs: { field: "name", value: "test", condition: "EQ" },
          schema: BUILTIN_ACTION_DEFINITIONS.EXECUTE_SCRIPT.schema,
        },
      ],
      trigger: {
        name: "trigger Step",
        tagline: "An automation trigger",
        description: "A trigger",
        icon: "Icon",
        id: "a",
        type: AutomationStepType.TRIGGER,
        event: AutomationEventType.ROW_SAVE,
        stepId: AutomationTriggerStepId.ROW_SAVED,
        inputs: {
          tableId: tableId!,
        },
        schema: TRIGGER_DEFINITIONS.ROW_SAVED.schema,
      },
    },
  }
  return automation
}

export function updateRowAutomationWithFilters(
  appId: string,
  tableId: string
): Automation {
  return {
    name: "updateRowWithFilters",
    type: "automation",
    appId,
    definition: {
      steps: [
        {
          name: "Filter Step",
          tagline: "An automation filter step",
          description: "A filter automation",
          icon: "Icon",
          id: "b",
          type: AutomationStepType.ACTION,
          internal: true,
          stepId: AutomationActionStepId.SERVER_LOG,
          inputs: { text: "log statement" },
          schema: BUILTIN_ACTION_DEFINITIONS.SERVER_LOG.schema,
        },
      ],
      trigger: {
        name: "trigger Step",
        tagline: "An automation trigger",
        description: "A trigger",
        icon: "Icon",
        id: "a",
        type: AutomationStepType.TRIGGER,
        event: AutomationEventType.ROW_UPDATE,
        stepId: AutomationTriggerStepId.ROW_UPDATED,
        inputs: { tableId },
        schema: TRIGGER_DEFINITIONS.ROW_UPDATED.schema,
      },
    },
  }
}

export function basicAutomationResults(
  automationId: string
): AutomationResults {
  return {
    automationId,
    status: AutomationStatus.SUCCESS,
    trigger: "trigger" as any,
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
  linkField = "link"
) {
  // this is based on the basic linked tables you get from the test configuration
  return {
    ...basicRow(tableId),
    [linkField]: [linkedRowId],
  }
}

export function basicRole(): Role {
  return {
    name: `NewRole_${utils.newid()}`,
    inherits: roles.BUILTIN_ROLE_IDS.BASIC,
    permissionId: BuiltinPermissionID.WRITE,
    permissions: {},
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

export function basicQuery(datasourceId: string): Query {
  return {
    datasourceId,
    name: "New Query",
    parameters: [],
    fields: {},
    schema: {},
    queryVerb: "read",
    transformer: null,
    readable: true,
  }
}

export function basicUser(role: string) {
  return {
    email: "bill@bill.com",
    password: "yeeooo",
    roleId: role,
  }
}

export function basicScreen(route = "/") {
  return createHomeScreen({
    roleId: BUILTIN_ROLE_IDS.BASIC,
    route,
  })
}

export function powerScreen(route = "/") {
  return createHomeScreen({
    roleId: BUILTIN_ROLE_IDS.POWER,
    route,
  })
}

export function customScreen(config: { roleId: string; route: string }) {
  return createHomeScreen(config)
}

export function basicLayout() {
  return cloneDeep(EMPTY_LAYOUT)
}

export function basicWebhook(automationId: string): Webhook {
  return {
    live: true,
    name: "webhook",
    action: {
      type: WebhookActionType.AUTOMATION,
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

export function fullSchemaWithoutLinks({
  allRequired,
}: {
  allRequired?: boolean
}): {
  [type in Exclude<FieldType, FieldType.LINK>]: FieldSchema & { type: type }
} {
  return {
    [FieldType.STRING]: {
      name: "string",
      type: FieldType.STRING,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.LONGFORM]: {
      name: "longform",
      type: FieldType.LONGFORM,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.OPTIONS]: {
      name: "options",
      type: FieldType.OPTIONS,
      constraints: {
        presence: allRequired,
        inclusion: ["option 1", "option 2", "option 3", "option 4"],
      },
    },
    [FieldType.ARRAY]: {
      name: "array",
      type: FieldType.ARRAY,
      constraints: {
        presence: allRequired,
        type: JsonFieldSubType.ARRAY,
        inclusion: ["options 1", "options 2", "options 3", "options 4"],
      },
    },
    [FieldType.NUMBER]: {
      name: "number",
      type: FieldType.NUMBER,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.BOOLEAN]: {
      name: "boolean",
      type: FieldType.BOOLEAN,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.DATETIME]: {
      name: "datetime",
      type: FieldType.DATETIME,
      dateOnly: true,
      timeOnly: false,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.FORMULA]: {
      name: "formula",
      type: FieldType.FORMULA,
      formula: "any formula",
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.AI]: {
      name: "ai",
      type: FieldType.AI,
      operation: AIOperationEnum.PROMPT,
      prompt: "Translate this into German :'{{ product }}'",
    },
    [FieldType.BARCODEQR]: {
      name: "barcodeqr",
      type: FieldType.BARCODEQR,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.BIGINT]: {
      name: "bigint",
      type: FieldType.BIGINT,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.BB_REFERENCE]: {
      name: "user",
      type: FieldType.BB_REFERENCE,
      subtype: BBReferenceFieldSubType.USER,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.BB_REFERENCE_SINGLE]: {
      name: "users",
      type: FieldType.BB_REFERENCE_SINGLE,
      subtype: BBReferenceFieldSubType.USER,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.ATTACHMENTS]: {
      name: "attachments",
      type: FieldType.ATTACHMENTS,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.ATTACHMENT_SINGLE]: {
      name: "attachment_single",
      type: FieldType.ATTACHMENT_SINGLE,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.AUTO]: {
      name: "auto",
      type: FieldType.AUTO,
      subtype: AutoFieldSubType.AUTO_ID,
      autocolumn: true,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.JSON]: {
      name: "json",
      type: FieldType.JSON,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.INTERNAL]: {
      name: "internal",
      type: FieldType.INTERNAL,
      constraints: {
        presence: allRequired,
      },
    },
    [FieldType.SIGNATURE_SINGLE]: {
      name: "signature_single",
      type: FieldType.SIGNATURE_SINGLE,
      constraints: {
        presence: allRequired,
      },
    },
  }
}
export function basicAttachment() {
  return {
    key: generator.guid(),
    name: generator.word(),
    extension: generator.word(),
    size: generator.natural(),
    url: `/${generator.guid()}`,
  }
}
