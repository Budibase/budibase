export const FIELDS = {
  STRING: {
    name: "Plain Text",
    icon: "ri-text",
    type: "string",
    value: "string",
    constraints: {
      type: "string",
      length: {},
      presence: { allowEmpty: true },
    },
  },
  NUMBER: {
    name: "Number",
    icon: "ri-number-1",
    type: "number",
    value: "number",
    constraints: {
      type: "number",
      presence: { allowEmpty: true },
      numericality: { greaterThanOrEqualTo: "", lessThanOrEqualTo: "" },
    },
  },
  BOOLEAN: {
    name: "True/False",
    icon: "ri-toggle-line",
    type: "boolean",
    value: "boolean",
    constraints: {
      type: "boolean",
      presence: { allowEmpty: true },
    },
  },
  // OPTIONS: {
  //   name: "Options",
  //   icon: "ri-list-check-2",
  //   type: "options",
  //   constraints: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
  // },
  // DATETIME: {
  //   name: "Date/Time",
  //   icon: "ri-calendar-event-fill",
  //   type: "string",
  //   value: "datetime",
  //   constraints: {
  //     type: "string",
  //     length: {},
  //     presence: { allowEmpty: true },
  //     datetime: {
  //       latest: "",
  //       earliest: "",
  //     },
  //   },
  // },
  // IMAGE: {
  //   name: "File",
  //   icon: "ri-image-line",
  //   type: "file",
  //   constraints: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
  // },
  // FILE: {
  //   name: "Image",
  //   icon: "ri-file-line",
  //   type: "file",
  //   constraints: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
  // },
  // LINKED_FIELDS: {
  //   name: "Linked Fields",
  //   icon: "ri-link",
  //   type: "link",
  //   modelId: null,
  //   constraints: {
  //     type: "array",
  //   },
  // },
}

export const BLOCKS = {
  NAME: {
    name: "Name",
    icon: "ri-text",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: { allowEmpty: true },
    },
  },
  COMPANY: {
    name: "Company",
    icon: "ri-store-line",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: { allowEmpty: true },
    },
  },
  EMAIL: {
    name: "Email",
    icon: "ri-mail-line",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: { allowEmpty: true },
    },
  },
  PHONE_NUMBER: {
    name: "Phone No.",
    icon: "ri-phone-line",
    type: "number",
    constraints: {
      type: "number",
      presence: { allowEmpty: true },
      numericality: {},
    },
  },
  VALUE: {
    name: "Value",
    icon: "ri-number-5",
    type: "number",
    constraints: {
      type: "number",
      presence: { allowEmpty: true },
      numericality: {},
    },
  },
  ACTIVE: {
    name: "Active",
    icon: "ri-toggle-line",
    type: "boolean",
    constraints: {
      type: "boolean",
      presence: { allowEmpty: true },
    },
  },
  URL: {
    name: "URL",
    icon: "ri-link",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: { allowEmpty: true },
    },
  },
  IMAGE: {
    name: "Image URL",
    icon: "ri-image-line",
    type: "string",
    constraints: {
      type: "string",
      length: {},
      presence: { allowEmpty: true },
    },
  },
  // PRIORITY: {
  //   name: "Options",
  //   icon: "ri-list-check-2",
  //   type: "options",
  //   constraints: {
  //     type: "string",
  //     presence: { allowEmpty: true },
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
      presence: { allowEmpty: true },
    },
  },
  // AVATAR: {
  //   name: "Avatar",
  //   icon: "ri-image-line",
  //   type: "image",
  //   constraints: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
  // },
  // PDF: {
  //   name: "PDF",
  //   icon: "ri-file-line",
  //   type: "file",
  //   constraints: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
  // },
}
