const FIELD_TYPES = ["string", "number", "boolean"]

export const FIELDS = {
  PLAIN_TEXT: {
    name: "Plain Text",
    icon: "ri-text",
    definition: {
      type: "string",
      constraints: {
        type: "string",
        length: {},
        presence: false,
      },
    },
  },
  NUMBER: {
    name: "Number",
    icon: "ri-number-1",
    definition: {
      type: "number",
      constraints: {
        type: "number",
        presence: false,
        numericality: {},
      },
    },
  },
  BOOLEAN: {
    name: "True/False",
    icon: "ri-toggle-line",
    definition: {
      type: "boolean",
      constraints: {
        type: "boolean",
        presence: false,
      },
    },
  },
  OPTIONS: {
    name: "Options",
    icon: "ri-list-check-2",
    definition: {
      type: "options",
      constraints: {
        type: "string",
        presence: false,
      },
    },
  },
  DATETIME: {
    name: "Date/Time",
    icon: "ri-calendar-event-fill",
    definition: {
      type: "date",
      constraints: {
        type: "date",
        datetime: {},
        presence: false,
      },
    },
  },
  IMAGE: {
    name: "Image",
    icon: "ri-image-line",
    definition: {
      type: "image",
      constraints: {
        type: "string",
        presence: false,
      },
    },
  },
  FILE: {
    name: "Image",
    icon: "ri-file-line",
    definition: {
      type: "file",
      constraints: {
        type: "string",
        presence: false,
      },
    },
  },
  DATA_LINK: {
    name: "Data Links",
    icon: "ri-link",
    definition: {
      type: "link",
      modelId: null,
      constraints: {
        type: "array",
      },
    },
  },
}

export const BLOCKS = {

}

export const TABLES = {}
