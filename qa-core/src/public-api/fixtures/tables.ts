import { CreateTableParams, Table } from "../../types"
import { generator } from "../../shared"

export const generateTable = (
  overrides: Partial<Table> = {}
): CreateTableParams => ({
  name: generator.word(),
  primaryDisplay: "testColumn",
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
    testColumn: {
      name: "testColumn",
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
