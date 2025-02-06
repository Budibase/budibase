import {
  BasicViewFieldMetadata,
  View,
  ViewCalculationFieldMetadata,
  ViewFieldMetadata,
  ViewV2,
  ViewV2Type,
} from "@budibase/types"
import { pickBy } from "lodash"

export function isCalculationField(
  field: ViewFieldMetadata
): field is ViewCalculationFieldMetadata {
  return "calculationType" in field
}

export function isBasicViewField(
  field: ViewFieldMetadata
): field is BasicViewFieldMetadata {
  return !isCalculationField(field)
}

type UnsavedViewV2 = Omit<ViewV2, "id" | "version">

export function isCalculationView(view: UnsavedViewV2) {
  return view.type === ViewV2Type.CALCULATION
}

export function hasCalculationFields(view: UnsavedViewV2) {
  return Object.values(view.schema || {}).some(isCalculationField)
}

export function calculationFields(view: UnsavedViewV2) {
  return pickBy(view.schema || {}, isCalculationField)
}

export function isVisible(field: ViewFieldMetadata) {
  return field.visible !== false
}

export function basicFields(view: UnsavedViewV2, opts?: { visible?: boolean }) {
  const { visible = true } = opts || {}
  return pickBy(view.schema || {}, field => {
    return !isCalculationField(field) && (!visible || isVisible(field))
  })
}

export function isV2(view: View | ViewV2): view is ViewV2 {
  return (view as ViewV2).version === 2
}
