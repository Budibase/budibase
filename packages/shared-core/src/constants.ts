export const OperatorOptions = {
  Equals: {
    value: "equal",
    label: "Equals",
  },
  NotEquals: {
    value: "notEqual",
    label: "Not equals",
  },
  Empty: {
    value: "empty",
    label: "Is empty",
  },
  NotEmpty: {
    value: "notEmpty",
    label: "Is not empty",
  },
  StartsWith: {
    value: "string",
    label: "Starts with",
  },
  Like: {
    value: "fuzzy",
    label: "Like",
  },
  MoreThan: {
    value: "rangeLow",
    label: "More than or equal to",
  },
  LessThan: {
    value: "rangeHigh",
    label: "Less than or equal to",
  },
  Contains: {
    value: "contains",
    label: "Contains",
  },
  NotContains: {
    value: "notContains",
    label: "Does not contain",
  },
  In: {
    value: "oneOf",
    label: "Is in",
  },
  ContainsAny: {
    value: "containsAny",
    label: "Has any",
  },
}

export const SqlNumberTypeRangeMap = {
  integer: {
    max: 2147483647,
    min: -2147483648,
  },
  int: {
    max: 2147483647,
    min: -2147483648,
  },
  smallint: {
    max: 32767,
    min: -32768,
  },
  mediumint: {
    max: 8388607,
    min: -8388608,
  },
}

export enum SocketEvent {
  UserUpdate = "UserUpdate",
  UserDisconnect = "UserDisconnect",
  Heartbeat = "Heartbeat",
}

export enum GridSocketEvent {
  RowChange = "RowChange",
  DatasourceChange = "DatasourceChange",
  SelectDatasource = "SelectDatasource",
  SelectCell = "SelectCell",
}

export enum BuilderSocketEvent {
  SelectApp = "SelectApp",
  TableChange = "TableChange",
  DatasourceChange = "DatasourceChange",
  LockTransfer = "LockTransfer",
  ScreenChange = "ScreenChange",
  AppMetadataChange = "AppMetadataChange",
  SelectResource = "SelectResource",
  AppPublishChange = "AppPublishChange",
  AutomationChange = "AutomationChange",
}

export const SocketSessionTTL = 60
export const ValidQueryNameRegex = /^[^()]*$/
export const ValidColumnNameRegex = /^[_a-zA-Z0-9\s]*$/g
