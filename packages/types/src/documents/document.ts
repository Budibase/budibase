export const SEPARATOR = "_"
export const UNICODE_MAX = "\ufff0"

export const prefixed = (type: DocumentType) => `${type}${SEPARATOR}`

export enum DocumentType {
  USER = "us",
  GROUP = "gr",
  WORKSPACE = "workspace",
  CONFIG = "config",
  TEMPLATE = "template",
  APP = "app",
  DEV = "dev",
  APP_DEV = "app_dev",
  APP_METADATA = "app_metadata",
  ROLE = "role",
  DEV_INFO = "devinfo",
  AUTOMATION_LOG = "log_au",
  ACCOUNT_METADATA = "acc_metadata",
  PLUGIN = "plg",
  DATASOURCE = "datasource",
  DATASOURCE_PLUS = "datasource_plus",
  APP_BACKUP = "backup",
  TABLE = "ta",
  ROW = "ro",
  AUTOMATION = "au",
  LINK = "li",
  WEBHOOK = "wh",
  INSTANCE = "inst",
  LAYOUT = "layout",
  SCREEN = "screen",
  QUERY = "query",
  DEPLOYMENTS = "deployments",
  METADATA = "metadata",
  MEM_VIEW = "view",
  USER_FLAG = "flag",
  AUTOMATION_METADATA = "meta_au",
  AUDIT_LOG = "al",
  SCIM_LOG = "scimlog",
  ROW_ACTIONS = "ra",
  OAUTH2_CONFIG = "oauth2",
  OAUTH2_CONFIG_LOG = "oauth2log",
  AGENT_CHAT = "agentchat",
  AGENT_TOOL_SOURCE = "agenttoolsource",
  WORKSPACE_APP = "workspace_app",
}

// these are the core documents that make up the data, design
// and automation sections of an app. This excludes any internal
// rows as we shouldn't import data.
export const DocumentTypesToImport: DocumentType[] = [
  DocumentType.ROLE,
  DocumentType.DATASOURCE,
  DocumentType.DATASOURCE_PLUS,
  DocumentType.TABLE,
  DocumentType.AUTOMATION,
  DocumentType.WEBHOOK,
  DocumentType.SCREEN,
  DocumentType.QUERY,
  DocumentType.METADATA,
  DocumentType.MEM_VIEW,
  DocumentType.WORKSPACE_APP,
  // Deprecated but still copied
  DocumentType.INSTANCE,
  DocumentType.LAYOUT,
]

export enum InternalTable {
  USER_METADATA = "ta_users",
}

// these documents don't really exist, they are part of other
// documents or enriched into existence as part of get requests
export enum VirtualDocumentType {
  VIEW = "view",
  ROW_ACTION = "row_action",
}

export interface Document {
  _id?: string
  _rev?: string
  // document has been tombstoned - needed for replication
  _deleted?: boolean
  createdAt?: string | number
  updatedAt?: string
}

export interface AnyDocument extends Document {
  [key: string]: any
}
