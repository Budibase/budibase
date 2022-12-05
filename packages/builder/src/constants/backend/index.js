export const FIELDS = {
  STRING: {
    name: "Text",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  BARCODEQR: {
    name: "Barcode/QR",
    type: "barcodeqr",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  LONGFORM: {
    name: "Long Form Text",
    type: "longform",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  OPTIONS: {
    name: "Options",
    type: "options",
    constraints: {
      type: "string",
      presence: false,
      inclusion: [],
    },
  },
  ARRAY: {
    name: "Multi-select",
    type: "array",
    constraints: {
      type: "array",
      presence: false,
      inclusion: [],
    },
  },
  NUMBER: {
    name: "Number",
    type: "number",
    constraints: {
      type: "number",
      presence: false,
      numericality: { greaterThanOrEqualTo: "", lessThanOrEqualTo: "" },
    },
  },
  BOOLEAN: {
    name: "Boolean",
    type: "boolean",
    constraints: {
      type: "boolean",
      presence: false,
    },
  },
  DATETIME: {
    name: "Date/Time",
    type: "datetime",
    constraints: {
      type: "string",
      length: {},
      presence: false,
      datetime: {
        latest: "",
        earliest: "",
      },
    },
  },
  ATTACHMENT: {
    name: "Attachment",
    type: "attachment",
    constraints: {
      type: "array",
      presence: false,
    },
  },
  LINK: {
    name: "Relationship",
    type: "link",
    constraints: {
      type: "array",
      presence: false,
    },
  },
  FORMULA: {
    name: "Formula",
    type: "formula",
    constraints: {},
  },
  JSON: {
    name: "JSON",
    type: "json",
    constraints: {
      type: "object",
      presence: false,
    },
  },
}

export const AUTO_COLUMN_SUB_TYPES = {
  AUTO_ID: "autoID",
  CREATED_BY: "createdBy",
  CREATED_AT: "createdAt",
  UPDATED_BY: "updatedBy",
  UPDATED_AT: "updatedAt",
}

export const AUTO_COLUMN_DISPLAY_NAMES = {
  AUTO_ID: "Auto ID",
  CREATED_BY: "Created By",
  CREATED_AT: "Created At",
  UPDATED_BY: "Updated By",
  UPDATED_AT: "Updated At",
}

export const FILE_TYPES = {
  IMAGE: ["png", "tiff", "gif", "raw", "jpg", "jpeg"],
  CODE: ["js", "rs", "py", "java", "rb", "hs", "yml"],
  DOCUMENT: ["odf", "docx", "doc", "pdf", "csv"],
}

export const HostingTypes = {
  CLOUD: "cloud",
  SELF: "self",
}

export const Roles = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
}

export function isAutoColumnUserRelationship(subtype) {
  return (
    subtype === AUTO_COLUMN_SUB_TYPES.CREATED_BY ||
    subtype === AUTO_COLUMN_SUB_TYPES.UPDATED_BY
  )
}

export const RelationshipTypes = {
  MANY_TO_MANY: "many-to-many",
  ONE_TO_MANY: "one-to-many",
  MANY_TO_ONE: "many-to-one",
}

export const ALLOWABLE_STRING_OPTIONS = [
  FIELDS.STRING,
  FIELDS.OPTIONS,
  FIELDS.LONGFORM,
  FIELDS.BARCODEQR,
]
export const ALLOWABLE_STRING_TYPES = ALLOWABLE_STRING_OPTIONS.map(
  opt => opt.type
)

export const ALLOWABLE_NUMBER_OPTIONS = [FIELDS.NUMBER, FIELDS.BOOLEAN]
export const ALLOWABLE_NUMBER_TYPES = ALLOWABLE_NUMBER_OPTIONS.map(
  opt => opt.type
)

export const SWITCHABLE_TYPES = [
  ...ALLOWABLE_STRING_TYPES,
  ...ALLOWABLE_NUMBER_TYPES,
]

export const BUDIBASE_INTERNAL_DB_ID = "bb_internal"
export const DEFAULT_BB_DATASOURCE_ID = "datasource_internal_bb_default"
export const BUDIBASE_DATASOURCE_TYPE = "budibase"
export const DB_TYPE_INTERNAL = "internal"
export const DB_TYPE_EXTERNAL = "external"

export const IntegrationTypes = {
  POSTGRES: "POSTGRES",
  MONGODB: "MONGODB",
  COUCHDB: "COUCHDB",
  S3: "S3",
  MYSQL: "MYSQL",
  REST: "REST",
  DYNAMODB: "DYNAMODB",
  ELASTICSEARCH: "ELASTICSEARCH",
  SQL_SERVER: "SQL_SERVER",
  AIRTABLE: "AIRTABLE",
  ARANGODB: "ARANGODB",
  ORACLE: "ORACLE",
  INTERNAL: "INTERNAL",
  GOOGLE_SHEETS: "GOOGLE_SHEETS",
  FIRESTORE: "FIRESTORE",
  REDIS: "REDIS",
  SNOWFLAKE: "SNOWFLAKE",
}

export const IntegrationNames = {
  [IntegrationTypes.POSTGRES]: "PostgreSQL",
  [IntegrationTypes.MONGODB]: "MongoDB",
  [IntegrationTypes.COUCHDB]: "CouchDB",
  [IntegrationTypes.S3]: "S3",
  [IntegrationTypes.MYSQL]: "MySQL",
  [IntegrationTypes.REST]: "REST",
  [IntegrationTypes.DYNAMODB]: "DynamoDB",
  [IntegrationTypes.ELASTICSEARCH]: "ElasticSearch",
  [IntegrationTypes.SQL_SERVER]: "SQL Server",
  [IntegrationTypes.AIRTABLE]: "Airtable",
  [IntegrationTypes.ARANGODB]: "ArangoDB",
  [IntegrationTypes.ORACLE]: "Oracle",
  [IntegrationTypes.INTERNAL]: "Internal",
  [IntegrationTypes.GOOGLE_SHEETS]: "Google Sheets",
  [IntegrationTypes.FIRESTORE]: "Firestore",
  [IntegrationTypes.REDIS]: "Redis",
  [IntegrationTypes.SNOWFLAKE]: "Snowflake",
}

export const SchemaTypeOptions = [
  { label: "Text", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Datetime", value: "datetime" },
]

export const RawRestBodyTypes = {
  NONE: "none",
  FORM: "form",
  ENCODED: "encoded",
  JSON: "json",
  TEXT: "text",
  XML: "xml",
}

export const RestBodyTypes = [
  { name: "none", value: "none" },
  { name: "form-data", value: "form" },
  { name: "x-www-form-encoded", value: "encoded" },
  { name: "raw (JSON)", value: "json" },
  { name: "raw (XML)", value: "xml" },
  { name: "raw (Text)", value: "text" },
]

export const PaginationTypes = [
  { label: "Page number based", value: "page" },
  { label: "Cursor based", value: "cursor" },
]

export const PaginationLocations = [
  { label: "Query parameters", value: "query" },
  { label: "Request body", value: "body" },
]

export const BannedSearchTypes = [
  "link",
  "attachment",
  "formula",
  "json",
  "jsonarray",
]
