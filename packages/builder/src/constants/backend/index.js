const FIELD_TYPES = ["string", "number", "boolean"]

export const FIELDS = {
  PLAIN_TEXT: {
    name: "Plain Text",
    icon: "ri-text",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  NUMBER: {
    name: "Number",
    icon: "ri-number-1",
    type: "number",
    constraints: {
      type: "number",
      presence: false,
      numericality: {},
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
  OPTIONS: {
    name: "Options",
    icon: "ri-list-check-2",
    type: "options",
    constraints: {
      type: "string",
      presence: false,
    },
  },
  DATETIME: {
    name: "Date/Time",
    icon: "ri-calendar-event-fill",
    type: "datetime",
    constraints: {
      type: "date",
      datetime: {},
      presence: false,
    },
  },
  IMAGE: {
    name: "Image",
    icon: "ri-image-line",
    type: "image",
    constraints: {
      type: "string",
      presence: false,
    },
  },
  FILE: {
    name: "Image",
    icon: "ri-file-line",
    type: "file",
    constraints: {
      type: "string",
      presence: false,
    },
  },
  DATA_LINK: {
    name: "Data Links",
    icon: "ri-link",
    type: "link",
    modelId: null,
    constraints: {
      type: "array",
    }
  },
}

export const BLOCKS = {

}

export const TABLES = {}
