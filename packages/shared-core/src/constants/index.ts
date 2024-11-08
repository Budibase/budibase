export * from "./ai"
export * from "./api"
export * from "./fields"
export * from "./rows"
export * from "./colors"
export * from "./themes"

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
  RoleChange = "RoleChange",
}

export const SocketSessionTTL = 60
export const ValidQueryNameRegex = /^[^()]*$/
export const ValidColumnNameRegex = /^[_a-zA-Z0-9\s]*$/g
export const ValidSnippetNameRegex = /^[a-z_][a-z0-9_]*$/i

export const REBOOT_CRON = "@reboot"

export const InvalidFileExtensions = [
  "7z",
  "action",
  "apk",
  "app",
  "bat",
  "bin",
  "cab",
  "cmd",
  "com",
  "command",
  "cpl",
  "csh",
  "ex_",
  "exe",
  "gadget",
  "inf1",
  "ins",
  "inx",
  "ipa",
  "isu",
  "job",
  "js",
  "jse",
  "ksh",
  "lnk",
  "msc",
  "msi",
  "msp",
  "mst",
  "osx",
  "out",
  "paf",
  "php",
  "pif",
  "prg",
  "ps1",
  "reg",
  "rgs",
  "run",
  "scr",
  "sct",
  "shb",
  "shs",
  "tar",
  "u3p",
  "vb",
  "vbe",
  "vbs",
  "vbscript",
  "wasm",
  "workflow",
  "ws",
  "wsf",
  "wsh",
  "zip",
]

export enum BpmCorrelationKey {
  ONBOARDING = "budibase:onboarding:correlationkey",
  VERIFY_SSO_LOGIN = "budibase:verify_sso_login:correlationkey",
}

export enum BpmInstanceKey {
  ONBOARDING = "budibase:onboarding:instancekey",
  VERIFY_SSO_LOGIN = "budibase:verify_sso_login:instancekey",
}

export enum BpmStatusKey {
  ONBOARDING = "budibase:onboarding:status",
  VERIFY_SSO_LOGIN = "budibase:verify_sso_login:status",
}

export enum BpmStatusValue {
  STARTED = "started",
  COMPLETING_ACCOUNT_INFO = "completing_account_info",
  VERIFYING_EMAIL = "verifying_email",
  COMPLETED = "completed",
  FAILED = "failed",
}

export const DEFAULT_BB_DATASOURCE_ID = "datasource_internal_bb_default"
