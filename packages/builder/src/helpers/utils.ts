import {
  AutoFieldSubType,
  Automation,
  DateFieldMetadata,
  FieldType,
  NumberFieldMetadata,
  RelationshipFieldMetadata,
  RelationshipType,
} from "@budibase/types"
import { ActionStepID } from "@/constants/backend/automations"
import { TableNames } from "@/constants"
import {
  AUTO_COLUMN_DISPLAY_NAMES,
  AUTO_COLUMN_SUB_TYPES,
  FIELDS,
} from "@/constants/backend"
import { utils } from "@budibase/shared-core"

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
): RelationshipFieldMetadata | NumberFieldMetadata | DateFieldMetadata {
  const base = {
    name,
    icon: "ri-magic-line",
    autocolumn: true,
  }

  switch (subtype) {
    case AUTO_COLUMN_SUB_TYPES.UPDATED_BY:
    case AUTO_COLUMN_SUB_TYPES.CREATED_BY:
      return {
        ...base,
        type: FieldType.LINK,
        subtype,
        constraints: FIELDS.LINK.constraints,
        tableId: TableNames.USERS,
        fieldName: `${tableName}-${name}`,
        relationshipType: RelationshipType.MANY_TO_ONE,
      }

    case AUTO_COLUMN_SUB_TYPES.AUTO_ID:
      return {
        ...base,
        type: FieldType.NUMBER,
        subtype,
        constraints: FIELDS.NUMBER.constraints,
      }
    case AUTO_COLUMN_SUB_TYPES.UPDATED_AT:
    case AUTO_COLUMN_SUB_TYPES.CREATED_AT:
      return {
        ...base,
        type: FieldType.DATETIME,
        subtype,
        constraints: FIELDS.DATETIME.constraints,
      }

    default:
      throw utils.unreachable(subtype, {
        message: "Cannot build auto column with supplied subtype",
      })
  }
}

export function checkForCollectStep(automation: Automation) {
  return automation.definition.steps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
}
