import { Row } from "@budibase/types"

export const generateNewRowForTable = (tableId: string): Row => {
  return {
    TestColumn: "TestRow",
    tableId: tableId,
  }
}
