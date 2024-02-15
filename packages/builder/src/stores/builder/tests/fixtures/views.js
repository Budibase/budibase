export const A_VIEW = {
  name: "Published",
  tableId: "ta_3c78cffe33664ca9bfb6b2b6cb3ee55a",
  filters: [],
  schema: {
    "Auto ID": {
      name: "Auto ID",
      type: "number",
      subtype: "autoID",
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: "number",
        presence: false,
        numericality: {
          greaterThanOrEqualTo: "",
          lessThanOrEqualTo: "",
        },
      },
      lastID: 2,
    },
    "Created By": {
      name: "Created By",
      type: "link",
      subtype: "createdBy",
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: "array",
        presence: false,
      },
      tableId: "ta_users",
      fieldName: "Guest-Created By",
      relationshipType: "many-to-many",
    },
    "Created At": {
      name: "Created At",
      type: "datetime",
      subtype: "createdAt",
      icon: "ri-magic-line",
      autocolumn: true,
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
    "Updated By": {
      name: "Updated By",
      type: "link",
      subtype: "updatedBy",
      icon: "ri-magic-line",
      autocolumn: true,
      constraints: {
        type: "array",
        presence: false,
      },
      tableId: "ta_users",
      fieldName: "Guest-Updated By",
      relationshipType: "many-to-many",
    },
    "Updated At": {
      name: "Updated At",
      type: "datetime",
      subtype: "updatedAt",
      icon: "ri-magic-line",
      autocolumn: true,
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
    Episode: {
      name: "Episode",
      type: "link",
      tableId: "ta_d4bf541ce0d84b16a1a8e0a060e5f7f7",
      fieldName: "Guest",
      relationshipType: "one-to-many",
    },
    Names: {
      type: "string",
      constraints: {
        type: "string",
        length: {
          maximum: "",
        },
        presence: false,
      },
      fieldName: "Guest",
      name: "Names",
    },
  },
}
