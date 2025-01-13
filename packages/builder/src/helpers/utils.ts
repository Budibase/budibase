import { AutoFieldSubType, Automation, FieldType } from "@budibase/types"
import { ActionStepID } from "@/constants/backend/automations"
import { TableNames } from "@/constants"
import {
  AUTO_COLUMN_DISPLAY_NAMES,
  AUTO_COLUMN_SUB_TYPES,
  FIELDS,
  isAutoColumnUserRelationship,
} from "@/constants/backend"

type AutoColumnInformation = Partial<
  Record<AutoFieldSubType, { enabled: boolean; name: string }>
>

export function getAutoColumnInformation(
  enabled = true
): AutoColumnInformation {
  const info: AutoColumnInformation = {}
  for (const [key, subtype] of Object.entries(AUTO_COLUMN_SUB_TYPES)) {
    // Because it's possible to replicate the functionality of CREATED_AT and
    // CREATED_BY columns with user column default values, we disable their creation
    if (
      subtype === AUTO_COLUMN_SUB_TYPES.CREATED_AT ||
      subtype === AUTO_COLUMN_SUB_TYPES.CREATED_BY
    ) {
      continue
    }
    const typedKey = key as keyof typeof AUTO_COLUMN_SUB_TYPES
    info[subtype] = {
      enabled,
      name: AUTO_COLUMN_DISPLAY_NAMES[typedKey],
    }
  }
  return info
}

export function buildAutoColumn(
  tableName: string,
  name: string,
  subtype: AutoFieldSubType
) {
  let type, constraints
  switch (subtype) {
    case AUTO_COLUMN_SUB_TYPES.UPDATED_BY:
    case AUTO_COLUMN_SUB_TYPES.CREATED_BY:
      type = FieldType.LINK
      constraints = FIELDS.LINK.constraints
      break
    case AUTO_COLUMN_SUB_TYPES.AUTO_ID:
      type = FieldType.NUMBER
      constraints = FIELDS.NUMBER.constraints
      break
    case AUTO_COLUMN_SUB_TYPES.UPDATED_AT:
    case AUTO_COLUMN_SUB_TYPES.CREATED_AT:
      type = FieldType.DATETIME
      constraints = FIELDS.DATETIME.constraints
      break
    default:
      type = FieldType.STRING
      constraints = FIELDS.STRING.constraints
      break
  }
  if (Object.values(AUTO_COLUMN_SUB_TYPES).indexOf(subtype) === -1) {
    throw "Cannot build auto column with supplied subtype"
  }
  const base = {
    name,
    type,
    subtype,
    icon: "ri-magic-line",
    autocolumn: true,
    constraints,
  }
  if (isAutoColumnUserRelationship(subtype)) {
    base.tableId = TableNames.USERS
    base.fieldName = `${tableName}-${name}`
  }
  return base
}

export function checkForCollectStep(automation: Automation) {
  return automation.definition.steps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
}
