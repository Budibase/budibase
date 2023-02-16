import { Table } from "@budibase/types"

export const generateTable = (): Table => {
  return {
    name: "Test Table",
    schema: {},
    sourceId: "bb_internal",
    type: "internal",
  }
}

export const generateNewColumnForTable = (tableData: any): Table => {
  const newColumn = tableData
  newColumn.schema = {
    TestColumn: {
      type: "string",
      name: "TestColumn",
      constraints: {
        presence: { allowEmpty: false },
        length: { maximum: null },
        type: "string",
      },
    },
  }
  newColumn.indexes = {
    0: "TestColumn",
  }
  newColumn.updatedAt = new Date().toISOString()
  return newColumn
}
