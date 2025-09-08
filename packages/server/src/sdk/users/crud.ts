import { context } from "@budibase/backend-core"
import { User } from "@budibase/types"

export function get(userId: string) {
  const db = context.getWorkspaceDB()
  return db.get<User>(userId)
}
