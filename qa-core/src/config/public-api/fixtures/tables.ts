import {
  CreateRowParams,
  CreateTableParams,
} from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import generator from "../TestConfiguration/generator"

export const generateTable = (overrides = {}): CreateTableParams => ({
  name: generator.word(),
  primaryDisplay: "sasa",
  schema: {
    "Auto ID": {
      autocolumn: true,
      name: "Auto ID",
      type: "number",
    },
    "Created At": {
      autocolumn: true,
      name: "Created At",
      type: "datetime",
    },
    "Created By": {
      autocolumn: true,
      fieldName: "test12-Created By",
      name: "Created By",
      relationshipType: "many-to-many",
      tableId: "ta_users",
      type: "link",
    },
    sasa: {
      name: "sasa",
      type: "string",
    },
    "Updated At": {
      autocolumn: true,
      name: "Updated At",
      type: "datetime",
    },
    "Updated By": {
      autocolumn: true,
      fieldName: "test12-Updated By",
      name: "Updated By",
      relationshipType: "many-to-many",
      tableId: "ta_users",
      type: "link",
    },
  },
  ...overrides,
})

export const generateRow = (overrides = {}): CreateRowParams => ({
  type: "row",
  tableId: "seed_table",
  sasa: "Mike",
  relationship: ["ro_ta_"],
  ...overrides,
})
