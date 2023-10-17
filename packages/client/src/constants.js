import { FieldType as FieldTypes } from "@budibase/types"
export { FieldType as FieldTypes } from "@budibase/types"

export const UnsortableTypes = [
  FieldTypes.FORMULA,
  FieldTypes.ATTACHMENT,
  FieldTypes.ARRAY,
  FieldTypes.LINK,
]

export const ActionTypes = {
  ValidateForm: "ValidateForm",
  UpdateFieldValue: "UpdateFieldValue",
  RefreshDatasource: "RefreshDatasource",
  AddDataProviderQueryExtension: "AddDataProviderQueryExtension",
  RemoveDataProviderQueryExtension: "RemoveDataProviderQueryExtension",
  SetDataProviderSorting: "SetDataProviderSorting",
  ClearForm: "ClearForm",
  ChangeFormStep: "ChangeFormStep",
  ScrollTo: "ScrollTo",
}

export const DNDPlaceholderID = "dnd-placeholder"
export const ScreenslotType = "screenslot"
