export const FieldTypes = {
  STRING: "string",
  BARCODEQR: "barcodeqr",
  LONGFORM: "longform",
  OPTIONS: "options",
  NUMBER: "number",
  BOOLEAN: "boolean",
  ARRAY: "array",
  DATETIME: "datetime",
  ATTACHMENT: "attachment",
  LINK: "link",
  FORMULA: "formula",
  JSON: "json",
}

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
}

export const DNDPlaceholderID = "dnd-placeholder"
export const ScreenslotType = "screenslot"
