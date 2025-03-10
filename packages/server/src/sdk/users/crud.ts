import { context } from "@budibase/backend-core"
import type { User } from "@budibase/types"

export function get(userId: string) {
  const db = context.getAppDB()
  return db.get<User>(userId)
}
