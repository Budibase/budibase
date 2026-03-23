import {
  EnvironmentVariablesDoc,
  EnvironmentVariablesDocDecrypted,
} from "@budibase/types"
import { tenancy, StaticDatabases, encryption } from "@budibase/backend-core"
import LRU from "lru-cache"

const MAX_CACHE_ITEMS = 1000
const cache = new LRU<string, EnvironmentVariablesDocDecrypted>({
  max: MAX_CACHE_ITEMS,
})

export function getEnvVarID() {
  return StaticDatabases.GLOBAL.docs.environmentVariables
}

export function getCacheEnvVarID(rev?: string) {
  const tenantId = tenancy.getTenantId()
  return `${tenantId}/${getEnvVarID()}/${rev || ""}`
}

export async function get(): Promise<EnvironmentVariablesDocDecrypted> {
  const id = getEnvVarID()
  const db = tenancy.getGlobalDB()
  let encrypted: EnvironmentVariablesDoc | undefined,
    notFound = false
  try {
    encrypted = (await db.get(id)) as EnvironmentVariablesDoc
  } catch (err: any) {
    if (err.status == 404) {
      notFound = true
    } else {
      throw err
    }
  }
  // now we have the document, can check the revision, see if we have it cached
  const cacheKey = getCacheEnvVarID(encrypted?._rev)
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }
  // wasn't found, decrypt and return
  let finalDoc: EnvironmentVariablesDocDecrypted
  if (!notFound && encrypted) {
    finalDoc = {
      ...encrypted,
      variables: JSON.parse(
        encryption.decrypt(
          encrypted.variables,
          encryption.SecretOption.ENCRYPTION
        )
      ),
    }
  } else {
    finalDoc = {
      _id: id,
      variables: {},
    }
  }
  cache.set(cacheKey, finalDoc)
  return finalDoc
}

export async function update(
  doc: EnvironmentVariablesDocDecrypted
): Promise<{ id: string; rev: string }> {
  const id = getEnvVarID()
  const db = tenancy.getGlobalDB()
  return await db.put({
    _id: doc._id || id,
    _rev: doc._rev || undefined,
    variables: encryption.encrypt(
      JSON.stringify(doc.variables),
      encryption.SecretOption.ENCRYPTION
    ),
  })
}
