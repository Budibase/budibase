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
  MIGRATIONS = "migrations",
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
  APP_MIGRATION_METADATA = "_design/migrations",
  SCIM_LOG = "scimlog",
  ROW_ACTIONS = "ra",
}

// Because DocumentTypes can overlap, we need to make sure that we search
// longest first to ensure we get the correct type.
const sortedDocumentTypes = Object.values(DocumentType).sort(
  (a, b) => b.length - a.length // descending
)
export function getDocumentType(id: string): DocumentType | undefined {
  return sortedDocumentTypes.find(docType =>
    id.startsWith(`${docType}${SEPARATOR}`)
  )
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

// Because VirtualDocumentTypes can overlap, we need to make sure that we search
// longest first to ensure we get the correct type.
const sortedVirtualDocumentTypes = Object.values(VirtualDocumentType).sort(
  (a, b) => b.length - a.length // descending
)
export function getVirtualDocumentType(
  id: string
): VirtualDocumentType | undefined {
  return sortedVirtualDocumentTypes.find(docType =>
    id.startsWith(`${docType}${SEPARATOR}`)
  )
}

export interface Document {
  _id?: string
  _rev?: string
  createdAt?: string | number
  updatedAt?: string
}

export interface AnyDocument extends Document {
  [key: string]: any
}
