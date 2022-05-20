import { events, db } from "@budibase/backend-core"
import { User } from "@budibase/types"

// manually define user doc params - normally server doesn't read users from the db
const getUserParams = (props: any) => {
  return db.getDocParams(db.DocumentTypes.USER, null, props)
}

const getUsers = async (globalDb: any): Promise<User[]> => {
  const response = await globalDb.allDocs(
    getUserParams({
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (globalDb: any) => {
  const users = await getUsers(globalDb)

  for (const user of users) {
    events.user.created(user)

    if (user.admin?.global) {
      events.user.permissionAdminAssigned(user)
    }

    if (user.builder?.global) {
      events.user.permissionBuilderAssigned(user)
    }

    if (user.roles) {
      for (const [appId, role] of Object.entries(user.roles)) {
        events.role.assigned(user, role)
      }
    }
  }
}
