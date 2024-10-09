import { Row, Table } from "@budibase/types"

import * as external from "./external"
import * as internal from "./internal"
import { isExternal } from "./utils"
import { setPermissions } from "../permissions"
import { roles } from "@budibase/backend-core"

export async function create(
  table: Omit<Table, "_id" | "_rev">,
  rows?: Row[],
  userId?: string
): Promise<Table> {
  let createdTable: Table
  if (isExternal({ table })) {
    createdTable = await external.create(table)
  } else {
    createdTable = await internal.create(table, rows, userId)
  }

  await setPermissions(createdTable._id!, {
    writeRole: roles.BUILTIN_ROLE_IDS.ADMIN,
    readRole: roles.BUILTIN_ROLE_IDS.ADMIN,
  })

  return createdTable
}
