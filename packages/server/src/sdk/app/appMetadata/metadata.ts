import { context, DocumentType } from "@budibase/backend-core"
import { App } from "@budibase/types"

export async function get() {
  const db = context.getAppDB()
  const application = await db.get<App>(DocumentType.APP_METADATA)
  return application
}
