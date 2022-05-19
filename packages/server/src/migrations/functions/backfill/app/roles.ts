import { events, db } from "@budibase/backend-core"
import { getRoleParams } from "../../../../db/utils"
import { Role } from "@budibase/types"

const getRoles = async (appDb: any): Promise<Role[]> => {
  const response = await appDb.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any) => {
  if (db.isDevAppID(appDb.name)) {
    const roles = await getRoles(appDb)

    for (const role of roles) {
      events.role.created(role)
    }
  }
}
