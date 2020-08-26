export const FIELDS = {
  STRING: {
    name: "Plain Text",
    icon: "ri-text",
    type: "string",
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
