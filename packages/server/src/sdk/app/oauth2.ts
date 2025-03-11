import { context, HTTPError } from "@budibase/backend-core"
import { DocumentType, OAuth2Config, OAuth2Configs } from "@budibase/types"

export async function fetch(): Promise<OAuth2Config[]> {
  const db = context.getAppDB()
  const result = await db.tryGet<OAuth2Configs>(DocumentType.OAUTH2_CONFIG)
  if (!result) {
    return []
  }
  return Object.values(result.configs)
}

export async function create(config: OAuth2Config) {
  const db = context.getAppDB()
  const doc: OAuth2Configs = (await db.tryGet<OAuth2Configs>(
    DocumentType.OAUTH2_CONFIG
  )) ?? {
    _id: DocumentType.OAUTH2_CONFIG,
    configs: {},
  }

  if (doc.configs[config.name]) {
    throw new HTTPError("Name already used", 400)
  }

  doc.configs[config.name] = config
  await db.put(doc)
}
