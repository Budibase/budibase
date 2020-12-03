export const FIELDS = {
  STRING: {
    name: "Text",
    icon: "ri-text",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  LONGFORM: {
    name: "Long Form Text",
    icon: "ri-file-text-line",
    type: "longform",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  OPTIONS: {
    name: "Options",
    icon: "ri-list-check-2",
    type: "options",
    constraints: {
      type: "string",
      presence: false,
      inclusion: [],
    },
  },
  NUMBER: {
    name: "Number",
    icon: "ri-number-1",
    type: "number",
    constraints: {
      type: "number",
      presence: false,
      numericality: { greaterThanOrEqualTo: "", lessThanOrEqualTo: "" },
    },
  },
  BOOLEAN: {
    name: "True/False",
    icon: "ri-toggle-line",
    type: "boolean",
    constraints: {
      type: "boolean",
      presence: false,
    },
  },
  DATETIME: {
    name: "Date/Time",
    icon: "ri-calendar-event-fill",
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
    icon: "ri-file-line",
    type: "attachment",
    constraints: {
      type: "array",
      presence: false,
    },
  },
  LINK: {
    name: "Relationship",
    icon: "ri-link",
    type: "link",
    constraints: {
      type: "array",
      presence: false,
    },
  },
}

export const FILE_TYPES = {
  IMAGE: ["png", "tiff", "gif", "raw", "jpg", "jpeg"],
  CODE: ["js", "rs", "py", "java", "rb", "hs", "yml"],
  DOCUMENT: ["odf", "docx", "doc", "pdf", "csv"],
}
