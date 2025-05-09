export { FieldType as FieldTypes } from "@budibase/types"

export const ActionTypes = {
  ValidateForm: "ValidateForm",
  UpdateFieldValue: "UpdateFieldValue",
  RefreshDatasource: "RefreshDatasource",
  AddDataProviderQueryExtension: "AddDataProviderQueryExtension",
  RemoveDataProviderQueryExtension: "RemoveDataProviderQueryExtension",
  AddDataProviderFilterExtension: "AddDataProviderFilterExtension",
  RemoveDataProviderFilterExtension: "RemoveDataProviderFilterExtension",
  SetDataProviderSorting: "SetDataProviderSorting",
  ClearForm: "ClearForm",
  ChangeFormStep: "ChangeFormStep",
  ScrollTo: "ScrollTo",
  ClearRowSelection: "ClearRowSelection",
}

export const PeekMessages = {
  NOTIFICATION: "notification",
  CLOSE_SCREEN_MODAL: "close-screen-modal",
  INVALIDATE_DATASOURCE: "invalidate-datasource",
  UPDATE_STATE: "update-state",
  REFRESH_ALL_DATASOURCES: "refresh-all-datasources",
}

export const DNDPlaceholderID = "dnd-placeholder"
export const ScreenslotType = "screenslot"
export const ScreenslotID = "screenslot"
export const GridRowHeight = 24
export const GridColumns = 12
export const GridSpacing = 4
