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
  // OPTIONS: {
  //   name: "Options",
  //   icon: "ri-list-check-2",
  //   type: "options",
  //   constraints: {
  //     type: "string",
  //     presence: false,
  //   },
  // },
  DATETIME: {
    name: "Date/Time",
    icon: "ri-calendar-event-fill",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  // IMAGE: {
  //   name: "File",
  //   icon: "ri-image-line",
  //   type: "file",
  //   constraints: {
  //     type: "string",
  //     presence: false,
  //   },
  // },
  // FILE: {
  //   name: "Image",
  //   icon: "ri-file-line",
  //   type: "file",
  //   constraints: {
  //     type: "string",
  //     presence: false,
  //   },
  // },
  LINKED_FIELDS: {
    name: "Linked Fields",
    icon: "ri-link",
    type: "link",
    modelId: null,
    constraints: {
      type: "array",
    },
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
  COMPANY: {
    name: "Company",
    icon: "ri-store-line",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  EMAIL: {
    name: "Email",
    icon: "ri-mail-line",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  PHONE_NUMBER: {
    name: "Phone No.",
    icon: "ri-phone-line",
    type: "number",
    constraints: {
      type: "number",
      presence: false,
      numericality: {},
    },
  },
  VALUE: {
    name: "Value",
    icon: "ri-number-5",
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
  URL: {
    name: "URL",
    icon: "ri-link",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  IMAGE: {
    name: "Image URL",
    icon: "ri-image-line",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  // PRIORITY: {
  //   name: "Options",
  //   icon: "ri-list-check-2",
  //   type: "options",
  //   constraints: {
  //     type: "string",
  //     presence: false,
  //     inclusion: ["low", "medium", "high"],
  //   },
  // },
  END_DATE: {
    name: "End Date",
    icon: "ri-calendar-event-fill",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: false,
    },
  },
  // AVATAR: {
  //   name: "Avatar",
  //   icon: "ri-image-line",
  //   type: "image",
  //   constraints: {
  //     type: "string",
  //     presence: false,
  //   },
  // },
  // PDF: {
  //   name: "PDF",
  //   icon: "ri-file-line",
  //   type: "file",
  //   constraints: {
  //     type: "string",
  //     presence: false,
  //   },
  // },
}

export const MODELS = {
  CONTACTS: {
    icon: "ri-contacts-book-line",
    name: "Contacts",
    schema: {
      Name: BLOCKS.NAME,
      "Phone Number": BLOCKS.PHONE_NUMBER,
    },
  },
  RECIPES: {
    icon: "ri-link",
    name: "Recipes",
    schema: {
      Name: BLOCKS.NAME,
      Cuisine: {
        ...FIELDS.PLAIN_TEXT,
        name: "Cuisine",
      },
    },
  },
  SPORTS_TEAM: {
    icon: "ri-basketball-line",
    name: "Sports Team",
    schema: {
      Name: BLOCKS.NAME,
      Championships: {
        ...FIELDS.NUMBER,
        name: "Championships",
      },
    },
  },
}
