import { HTTPError } from "@budibase/backend-core"
import { Table } from "@budibase/types"

export function assertWritableTable(table: Table) {
  if (table.readonly) {
    throw new HTTPError(`Table "${table.name}" is read-only`, 400)
  }
}
