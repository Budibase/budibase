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
    constraints: {
      type: "string",
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
