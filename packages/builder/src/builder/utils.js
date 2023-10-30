import { ActionStepID } from "constants/backend/automations"
import { TableNames } from "../constants"
import {
  AUTO_COLUMN_DISPLAY_NAMES,
  AUTO_COLUMN_SUB_TYPES,
  FIELDS,
  isAutoColumnUserRelationship,
} from "../constants/backend"

export function getAutoColumnInformation(enabled = true) {
  let info = {}
  for (let [key, subtype] of Object.entries(AUTO_COLUMN_SUB_TYPES)) {
    info[subtype] = { enabled, name: AUTO_COLUMN_DISPLAY_NAMES[key] }
  }
  return info
}

export function buildAutoColumn(tableName, name, subtype) {
  let type, constraints
  switch (subtype) {
    case AUTO_COLUMN_SUB_TYPES.UPDATED_BY:
    case AUTO_COLUMN_SUB_TYPES.CREATED_BY:
      type = FIELDS.LINK.type
      constraints = FIELDS.LINK.constraints
      break
    case AUTO_COLUMN_SUB_TYPES.AUTO_ID:
      type = FIELDS.NUMBER.type
      constraints = FIELDS.NUMBER.constraints
      break
    case AUTO_COLUMN_SUB_TYPES.UPDATED_AT:
    case AUTO_COLUMN_SUB_TYPES.CREATED_AT:
      type = FIELDS.DATETIME.type
      constraints = FIELDS.DATETIME.constraints
      break
    default:
      type = FIELDS.STRING.type
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

export function checkForCollectStep(automation) {
  return automation.definition.steps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
}
