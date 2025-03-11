import { context } from "@budibase/backend-core"
import { DocumentType, OAuth2Configs } from "@budibase/types"

export async function fetch() {
  const db = context.getAppDB()
  const result = await db.tryGet<OAuth2Configs>(DocumentType.OAUTH2_CONFIG)
  return result?.configs
}
