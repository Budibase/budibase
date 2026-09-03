import { AutomationIOType, FieldType, ToolType } from "@budibase/types"
import type {
  Automation,
  FieldConstraints,
  Query,
  Table,
  ToolExecutionCondition,
} from "@budibase/types"
import { OperatorOptions, isQueryToolType } from "@budibase/shared-core"
import { Helpers } from "@budibase/bbui"
import type { AgentTool } from "./toolTypes"

const OPERATOR_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(OperatorOptions).map(option => [option.value, option.label])
)

const OPERATOR_PHRASES: Record<string, (value: string) => string> = {
  equal: value => `is ${value}`,
  notEqual: value => `is not ${value}`,
  empty: () => "is empty",
  notEmpty: () => "is not empty",
  rangeLow: value => `is more than or equal to ${value}`,
  rangeHigh: value => `is less than or equal to ${value}`,
}

const describeValue = (condition: ToolExecutionCondition) => {
  if (Array.isArray(condition.value)) {
    return condition.value.join(", ")
  }
  if (
    condition.type === FieldType.DATETIME &&
    typeof condition.value === "string"
  ) {
    return Helpers.getDateDisplayValue(condition.value)
  }
  return `${condition.value ?? ""}`
}

export const describeCondition = (condition: ToolExecutionCondition) => {
  const value = describeValue(condition)
  const phrase = OPERATOR_PHRASES[condition.operator]
  if (phrase) {
    return `${condition.field} ${phrase(value)}`.trim()
  }
  const operator =
    OPERATOR_LABELS[condition.operator]?.toLowerCase() ?? condition.operator
  return `${condition.field} ${operator} ${value}`.trim()
}

export const describeConditions = (conditions?: ToolExecutionCondition[]) =>
  conditions?.length
    ? `When ${conditions.map(describeCondition).join(" and ")}`
    : "Always"

export interface ConditionField {
  name: string
  label: string
  type: FieldType
  constraints?: FieldConstraints
}

const CONDITIONABLE_FIELD_TYPES = new Set<FieldType>([
  FieldType.STRING,
  FieldType.LONGFORM,
  FieldType.NUMBER,
  FieldType.BIGINT,
  FieldType.BOOLEAN,
  FieldType.OPTIONS,
  FieldType.ARRAY,
  FieldType.DATETIME,
])

const ROW_MUTATION_SUFFIXES = ["_create_row", "_update_row"]

const AUTOMATION_FIELD_TYPES: Partial<Record<AutomationIOType, FieldType>> = {
  [AutomationIOType.STRING]: FieldType.STRING,
  [AutomationIOType.NUMBER]: FieldType.NUMBER,
  [AutomationIOType.BOOLEAN]: FieldType.BOOLEAN,
  [AutomationIOType.ARRAY]: FieldType.ARRAY,
  [AutomationIOType.DATE]: FieldType.DATETIME,
  [AutomationIOType.DATETIME]: FieldType.DATETIME,
  [AutomationIOType.LONGFORM]: FieldType.LONGFORM,
}

const isRowMutationTool = (tool: AgentTool) =>
  (tool.sourceType === ToolType.INTERNAL_TABLE ||
    tool.sourceType === ToolType.EXTERNAL_TABLE) &&
  ROW_MUTATION_SUFFIXES.some(suffix => tool.runtimeBinding.endsWith(suffix))

const isAutomationTriggerTool = (tool: AgentTool) =>
  tool.sourceType === ToolType.AUTOMATION &&
  tool.runtimeBinding.endsWith("_trigger")

export const getToolConditionFields = ({
  tool,
  tables,
  queries,
  automations,
}: {
  tool: AgentTool
  tables: Table[]
  queries: Query[]
  automations: Automation[]
}): ConditionField[] => {
  if (!tool.sourceId) {
    return []
  }

  if (isRowMutationTool(tool)) {
    const table = tables.find(candidate => candidate._id === tool.sourceId)
    return Object.entries(table?.schema || {})
      .filter(([, field]) => CONDITIONABLE_FIELD_TYPES.has(field.type))
      .map(([name, field]) => ({
        name,
        label: name,
        type: field.type,
        constraints: field.constraints,
      }))
  }

  if (isQueryToolType(tool.sourceType)) {
    const query = queries.find(candidate => candidate._id === tool.sourceId)
    return (query?.parameters || []).map(parameter => ({
      name: parameter.name,
      label: parameter.name,
      type: FieldType.STRING,
    }))
  }

  if (isAutomationTriggerTool(tool)) {
    const automation = automations.find(
      candidate => candidate._id === tool.sourceId
    )
    const triggerInputs = automation?.definition?.trigger?.inputs as {
      fields?: Record<string, AutomationIOType>
    } | null
    return Object.entries(triggerInputs?.fields || {}).flatMap(
      ([name, ioType]) => {
        const type = AUTOMATION_FIELD_TYPES[ioType]
        return type ? [{ name, label: name, type }] : []
      }
    )
  }

  return []
}
