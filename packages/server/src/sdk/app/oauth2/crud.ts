import { context, HTTPError, utils } from "@budibase/backend-core"
import {
  Database,
  DocumentType,
  OAuth2Config,
  OAuth2Configs,
  PASSWORD_REPLACEMENT,
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
    throw new HTTPError(`OAuth2 config with id '${config.id}' not found.`, 404)
  }

  if (
    Object.values(doc.configs).find(
      c => c.name === config.name && c.id !== config.id
    )
  ) {
    throw new HTTPError(
      `OAuth2 config with name '${config.name}' is already taken.`,
      400
    )
  }

  doc.configs[config.id] = {
    ...config,
    clientSecret:
      config.clientSecret === PASSWORD_REPLACEMENT
        ? doc.configs[config.id].clientSecret
        : config.clientSecret,
  }

  await db.put(doc)
  return doc.configs[config.id]
}

export async function remove(configId: string): Promise<void> {
  const db = context.getAppDB()
  const doc: OAuth2Configs = (await getDocument(db)) ?? {
    _id: DocumentType.OAUTH2_CONFIG,
    configs: {},
  }

  if (!doc.configs[configId]) {
    throw new HTTPError(`OAuth2 config with id '${configId}' not found.`, 404)
  }

  delete doc.configs[configId]

  await db.put(doc)
}
