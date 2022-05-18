import { events, db } from "@budibase/backend-core"
import { Role, User } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const roles: Role[] = []

  for (const role of roles) {
    events.role.created(role)
    const user: User = {}
    events.role.assigned(user, role)
  }
}
