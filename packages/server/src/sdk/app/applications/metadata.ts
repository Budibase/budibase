import { context, DocumentType } from "@budibase/backend-core"
import { App } from "@budibase/types"

/**
 * @deprecated the plan is to get everything using `tryGet` instead, then rename
 * `tryGet` to `get`.
 */
export async function get() {
  const db = context.getAppDB()
  const application = await db.get<App>(DocumentType.APP_METADATA)
  return application
}

export async function tryGet() {
  const db = context.getAppDB()
  const application = await db.tryGet<App>(DocumentType.APP_METADATA)
  return application
}
