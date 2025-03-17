import { context, HTTPError, utils } from "@budibase/backend-core"
import {
  Database,
  DocumentType,
  OAuth2Config,
  OAuth2Configs,
  SEPARATOR,
  VirtualDocumentType,
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

  if (Object.values(doc.configs).find(c => c.name === config.name)) {
    throw new HTTPError("Name already used", 400)
  }

  const id = `${VirtualDocumentType.OAUTH2_CONFIG}${SEPARATOR}${utils.newid()}`
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

export async function update(config: OAuth2Config): Promise<OAuth2Config> {
  const db = context.getAppDB()
  const doc: OAuth2Configs = (await getDocument(db)) ?? {
    _id: DocumentType.OAUTH2_CONFIG,
    configs: {},
  }

  if (!doc.configs[config.id]) {
    throw new HTTPError(`OAuth2 config with id '${config.id}' not found.`, 400)
  }

  if (
    Object.values(doc.configs).find(
      c => c.name === config.name && c.id !== config.id
    )
  ) {
    throw new HTTPError("Name is not available.", 400)
  }

  doc.configs[config.id] = {
    ...config,
  }

  await db.put(doc)
  return doc.configs[config.id]
}
