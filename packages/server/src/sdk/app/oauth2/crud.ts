import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  DocumentType,
  OAuth2Config,
  PASSWORD_REPLACEMENT,
  SEPARATOR,
  WithRequired,
} from "@budibase/types"

async function guardName(name: string, id?: string) {
  const existingConfigs = await fetch()

  if (existingConfigs.find(c => c.name === name && c._id !== id)) {
    throw new HTTPError(
      `OAuth2 config with name '${name}' is already taken.`,
      400
    )
  }
}

export async function fetch(): Promise<OAuth2Config[]> {
  const db = context.getAppDB()
  const docs = await db.allDocs<OAuth2Config>(docIds.getOAuth2ConfigParams())
  const result = docs.rows.map(r => r.doc!)
  return result
}

export async function create(
  config: Omit<OAuth2Config, "id">
): Promise<OAuth2Config> {
  const db = context.getAppDB()

  await guardName(config.name)

  const response = await db.put({
    id: `${DocumentType.OAUTH2_CONFIG}${SEPARATOR}${utils.newid()}`,
    ...config,
  })
  return {
    _id: response.id,
    _rev: response.rev,
    ...config,
  }
}

export async function get(id: string): Promise<OAuth2Config | undefined> {
  const db = context.getAppDB()
  return await db.tryGet(id)
}

export async function update(
  config: WithRequired<OAuth2Config, "_id" | "_rev">
): Promise<OAuth2Config> {
  const db = context.getAppDB()
  await guardName(config.name, config._id)

  const existing = await get(config._id)
  if (!existing) {
    throw new HTTPError(`OAuth2 config with id '${config._id}' not found.`, 404)
  }

  const toUpdate = {
    ...config,
    clientSecret:
      config.clientSecret === PASSWORD_REPLACEMENT
        ? existing.clientSecret
        : config.clientSecret,
  }

  const result = await db.put(toUpdate)
  return { ...toUpdate, _rev: result.rev }
}

export async function remove(configId: string, _rev: string): Promise<void> {
  const db = context.getAppDB()
  await db.remove(configId, _rev)
}
