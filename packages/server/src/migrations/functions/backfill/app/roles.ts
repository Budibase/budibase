import { events } from "@budibase/backend-core"
import { Role } from "@budibase/types"
import { getRoleParams } from "../../../../db/utils"

const getRoles = async (appDb: any): Promise<Role[]> => {
  const response = await appDb.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any, timestamp: string | number) => {
  const roles = await getRoles(appDb)

  for (const role of roles) {
    await events.role.created(role, timestamp)
  }

  return roles.length
}
