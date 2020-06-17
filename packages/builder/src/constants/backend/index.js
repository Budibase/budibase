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
  NAME: {
    name: "Name",
    icon: "ri-text",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  PHONE_NUMBER: {
    name: "Phone Number",
    icon: "ri-number-1",
    type: "number",
    constraints: {
      type: "number",
      presence: false,
      numericality: {},
    },
  },
  ACTIVE: {
    name: "Active",
    icon: "ri-toggle-line",
    type: "boolean",
    constraints: {
      type: "boolean",
      presence: false,
    },
  },
  PRIORITY: {
    name: "Options",
    icon: "ri-list-check-2",
    type: "options",
    constraints: {
      type: "string",
      presence: false,
      inclusion: [
        "low",
        "medium",
        "high"
    ]
    },
  },
  END_DATE: {
    name: "End Date",
    icon: "ri-calendar-event-fill",
    type: "datetime",
    constraints: {
      type: "date",
      datetime: {},
      presence: false,
    },
  },
  AVATAR: {
    name: "Avatar",
    icon: "ri-image-line",
    type: "image",
    constraints: {
      type: "string",
      presence: false,
    },
  },
  PDF: {
    name: "PDF",
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

// TODO: Needs more thought, need to come up with the constraints etc for each one
export const MODELS = {
  CONTACTS: {
    icon: "ri-link",
    name: "Contacts",
    schema: {
      Name: BLOCKS.NAME,
      "Phone Number": BLOCKS.PHONE_NUMBER
    }
  },
  RECIPES: {
    icon: "ri-link",
    name: "Recipes",
    schema: {
      Name: BLOCKS.NAME,
      "Phone Number": BLOCKS.PHONE_NUMBER
    }
  }
}
