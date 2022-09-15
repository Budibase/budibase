import {
  CreateRowParams,
  CreateTableParams,
  Row,
  Table,
} from "../../../../../packages/server/src/api/controllers/public/mapping/types"
import generator from "../TestConfiguration/generator"

export const generateTable = (
  overrides: Partial<Table> = {}
): CreateTableParams => ({
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
      fieldName: generator.word(),
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
      fieldName: generator.word(),
      name: "Updated By",
      relationshipType: "many-to-many",
      tableId: "ta_users",
      type: "link",
    },
  },
  ...overrides,
})

export const generateRow = (overrides: Partial<Row> = {}): CreateRowParams => ({
  type: "row",
  tableId: "seed_table",
  sasa: generator.word(),
  relationship: [generator.string({ length: 32, alpha: true, numeric: true })],
  ...overrides,
})
