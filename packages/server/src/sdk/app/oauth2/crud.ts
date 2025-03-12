import { context, HTTPError, utils } from "@budibase/backend-core"
import {
  Database,
  DocumentType,
  OAuth2Config,
  OAuth2Configs,
} from "@budibase/types"

async function getDocument(db: Database = context.getAppDB()) {
  const result = await db.tryGet<OAuth2Configs>(DocumentType.OAUTH2_CONFIG)
  return result
}

export async function fetch(): Promise<OAuth2Config[]> {
  const result = await getDocument()
  if (!result) {
    return []
  }
  return Object.values(result.configs)
}

export async function create(
  config: Omit<OAuth2Config, "id">
): Promise<OAuth2Config> {
  const db = context.getAppDB()
  const doc: OAuth2Configs = (await getDocument(db)) ?? {
    _id: DocumentType.OAUTH2_CONFIG,
    configs: {},
  }

  if (doc.configs[config.name]) {
    throw new HTTPError("Name already used", 400)
  }

  const id = utils.newid()
  doc.configs[id] = {
    id,
    ...config,
  }

  await db.put(doc)
  return doc.configs[id]
}

export async function get(id: string): Promise<OAuth2Config | undefined> {
  const doc = await getDocument()
  return doc?.configs?.[id]
}
