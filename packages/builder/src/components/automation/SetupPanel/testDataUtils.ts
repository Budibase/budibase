import { type AutomationTrigger, AutomationEventType } from "@budibase/types"
import { cloneDeep } from "lodash/fp"

const rowTriggerEvents = [
  AutomationEventType.ROW_DELETE,
  AutomationEventType.ROW_UPDATE,
  AutomationEventType.ROW_SAVE,
  AutomationEventType.ROW_ACTION,
]

const isRowTriggerEvent = (
  event: AutomationEventType | undefined
): event is AutomationEventType => !!event && rowTriggerEvents.includes(event)

export const getTriggerTableId = (target: AutomationTrigger | undefined) => {
  const tableId = (target?.inputs as { tableId?: unknown } | undefined)?.tableId
  return typeof tableId === "string" ? tableId : undefined
}

export const parseTestDataForTrigger = (
  trigger: AutomationTrigger | undefined,
  data: Record<string, unknown> | undefined
) => {
  const tableId = getTriggerTableId(trigger)
  if (
    isRowTriggerEvent(trigger?.event) &&
    (data as { row?: { tableId?: string } } | undefined)?.row?.tableId !==
      tableId
  ) {
    return {
      row: { tableId },
      meta: {},
      id: "",
      revision: "",
    } as Record<string, unknown>
  }

  return cloneDeep(data) as Record<string, unknown>
}

export const isTriggerValidForTestData = (
  trigger: AutomationTrigger | undefined
) => {
  if (isRowTriggerEvent(trigger?.event) && !getTriggerTableId(trigger)) {
    return false
  }
  return true
}

export const normalizeParsedJsonForTrigger = (
  trigger: AutomationTrigger | undefined,
  parsedJson: Record<string, unknown>
) => {
  const normalized = cloneDeep(parsedJson) as {
    row?: { tableId?: string }
    [key: string]: unknown
  }

  if (isRowTriggerEvent(trigger?.event)) {
    const tableId = getTriggerTableId(trigger)
    if (!normalized.row) {
      normalized.row = {}
    }
    if (normalized.row.tableId !== tableId) {
      normalized.row.tableId = tableId
    }
  }

  return normalized as Record<string, unknown>
}

export const buildTriggerSchemaProperties = (
  trigger: AutomationTrigger | undefined
) => {
  let schema = Object.entries(
    trigger?.schema?.outputs?.properties || {}
  ) as Array<[string, Record<string, unknown>]>

  if (trigger?.event === AutomationEventType.APP_TRIGGER) {
    schema = [["fields", { customType: "fields" }]]
  }

  return schema
}
