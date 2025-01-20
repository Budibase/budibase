import {
  FieldType,
  BBReferenceFieldSubType,
  INTERNAL_TABLE_SOURCE_ID,
  AutoFieldSubType,
  Hosting,
} from "@budibase/types"
import { Constants } from "@budibase/frontend-core"

const { TypeIconMap } = Constants

export {
  RelationshipType,
  RowExportFormat as ROW_EXPORT_FORMATS,
} from "@budibase/types"

export const AUTO_COLUMN_SUB_TYPES = AutoFieldSubType

export const AUTO_COLUMN_DISPLAY_NAMES: Record<
  keyof typeof AUTO_COLUMN_SUB_TYPES,
  string
> = {
  AUTO_ID: "Auto ID",
  CREATED_BY: "Created By",
  CREATED_AT: "Created At",
  UPDATED_BY: "Updated By",
  UPDATED_AT: "Updated At",
}

export const FIELDS = {
  STRING: {
    name: "Text",
    type: FieldType.STRING,
    icon: TypeIconMap[FieldType.STRING],
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  BARCODEQR: {
    name: "Barcode / QR",
    type: FieldType.BARCODEQR,
    icon: TypeIconMap[FieldType.BARCODEQR],
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  LONGFORM: {
    name: "Long form text",
    type: FieldType.LONGFORM,
    icon: TypeIconMap[FieldType.LONGFORM],
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  OPTIONS: {
    name: "Single select",
    type: FieldType.OPTIONS,
    icon: TypeIconMap[FieldType.OPTIONS],
    constraints: {
      type: "string",
      presence: false,
      inclusion: [],
    },
  },
  ARRAY: {
    name: "Multi select",
    type: FieldType.ARRAY,
    icon: TypeIconMap[FieldType.ARRAY],
    constraints: {
      type: "array",
      presence: false,
      inclusion: [],
    },
  },
  NUMBER: {
    name: "Number",
    type: FieldType.NUMBER,
    icon: TypeIconMap[FieldType.NUMBER],
    constraints: {
      type: "number",
      presence: false,
      numericality: { greaterThanOrEqualTo: "", lessThanOrEqualTo: "" },
    },
  },
  BIGINT: {
    name: "Big integer",
    type: FieldType.BIGINT,
    icon: TypeIconMap[FieldType.BIGINT],
  },
  BOOLEAN: {
    name: "Boolean",
    type: FieldType.BOOLEAN,
    icon: TypeIconMap[FieldType.BOOLEAN],
    constraints: {
      type: "boolean",
      presence: false,
    },
  },
  DATETIME: {
    name: "Date / time",
    type: FieldType.DATETIME,
    icon: TypeIconMap[FieldType.DATETIME],
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
  ATTACHMENT_SINGLE: {
    name: "Single attachment",
    type: FieldType.ATTACHMENT_SINGLE,
    icon: TypeIconMap[FieldType.ATTACHMENT_SINGLE],
    constraints: {
      presence: false,
    },
  },
  ATTACHMENTS: {
    name: "Multi attachment",
    type: FieldType.ATTACHMENTS,
    icon: TypeIconMap[FieldType.ATTACHMENTS],
    constraints: {
      type: "array",
      presence: false,
    },
  },
  SIGNATURE_SINGLE: {
    name: "Signature",
    type: FieldType.SIGNATURE_SINGLE,
    icon: "AnnotatePen",
    constraints: {
      presence: false,
    },
  },
  LINK: {
    name: "Relationship",
    type: FieldType.LINK,
    icon: TypeIconMap[FieldType.LINK],
    constraints: {
      type: "array",
      presence: false,
    },
  },
  AUTO: {
    name: "Auto column",
    type: FieldType.AUTO,
    icon: TypeIconMap[FieldType.AUTO],
    constraints: {},
  },
  FORMULA: {
    name: "Formula",
    type: FieldType.FORMULA,
    icon: TypeIconMap[FieldType.FORMULA],
    constraints: {},
  },
  AI: {
    name: "AI",
    type: FieldType.AI,
    icon: TypeIconMap[FieldType.AI],
    constraints: {},
  },
  JSON: {
    name: "JSON",
    type: FieldType.JSON,
    icon: TypeIconMap[FieldType.JSON],
    constraints: {
      type: "object",
      presence: false,
    },
  },
  USER: {
    name: "Single user",
    type: FieldType.BB_REFERENCE_SINGLE,
    subtype: BBReferenceFieldSubType.USER,
    icon: TypeIconMap[FieldType.BB_REFERENCE_SINGLE][
      BBReferenceFieldSubType.USER
    ],
  },
  USERS: {
    name: "Multi user",
    type: FieldType.BB_REFERENCE,
    subtype: BBReferenceFieldSubType.USER,
    icon: TypeIconMap[FieldType.BB_REFERENCE][BBReferenceFieldSubType.USER],
    constraints: {
      type: "array",
    },
  },
}

export const FILE_TYPES = {
  IMAGE: ["png", "tiff", "gif", "raw", "jpg", "jpeg"],
  CODE: ["js", "rs", "py", "java", "rb", "hs", "yml"],
  DOCUMENT: ["odf", "docx", "doc", "pdf", "csv"],
}

export const HostingTypes = Hosting

export const Roles = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
}

export const PrettyRelationshipDefinitions = {
  MANY: "Many rows",
  ONE: "One row",
}

export const BUDIBASE_INTERNAL_DB_ID = INTERNAL_TABLE_SOURCE_ID
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
  { label: "Text", value: FieldType.STRING },
  { label: "Number", value: FieldType.NUMBER },
  { label: "Boolean", value: FieldType.BOOLEAN },
  { label: "Datetime", value: FieldType.DATETIME },
  { label: "JSON", value: FieldType.JSON },
]

export const SchemaTypeOptionsExpanded = SchemaTypeOptions.map(el => ({
  ...el,
  value: { type: el.value },
}))

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

export const DatasourceTypes = {
  RELATIONAL: "Relational",
  NON_RELATIONAL: "Non-relational",
  SPREADSHEET: "Spreadsheet",
  OBJECT_STORE: "Object store",
  GRAPH: "Graph",
  API: "API",
}
