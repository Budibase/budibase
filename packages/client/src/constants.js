export { FieldType as FieldTypes } from "@budibase/types"

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

export const ContextScopes = {
  Local: "local",
  Global: "global",
}

export const DNDPlaceholderID = "dnd-placeholder"
export const ScreenslotType = "screenslot"
