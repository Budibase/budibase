import { PreSaveSQLiteDefinition } from "@budibase/types"
import { SQLITE_DESIGN_DOC_ID } from "../constants"

// the table id property defines which property in the document
// to use when splitting the documents into different sqlite tables
export function base(tableIdProp: string): PreSaveSQLiteDefinition {
  return {
    _id: SQLITE_DESIGN_DOC_ID,
    language: "sqlite",
    sql: {
      tables: {},
      options: {
        table_name: tableIdProp,
      },
    },
  }
}
