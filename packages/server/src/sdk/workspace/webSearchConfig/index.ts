import { context, docIds } from "@budibase/backend-core"
import {
  PASSWORD_REPLACEMENT,
  WebSearchConfig,
  WebSearchConfigResponse,
  WebSearchProvider,
} from "@budibase/types"

export async function get(): Promise<WebSearchConfig | null> {
  const db = context.getWorkspaceDB()
  const configId = docIds.getWebSearchConfigID()
  const result = await db.tryGet<WebSearchConfig>(configId)
  return result ?? null
}

export async function save(request: {
  provider: WebSearchProvider
  apiKey: string
  enabled: boolean
}): Promise<WebSearchConfig> {
  const db = context.getWorkspaceDB()
  const configId = docIds.getWebSearchConfigID()
  const existing = await db.tryGet<WebSearchConfig>(configId)

  // Handle PASSWORD_REPLACEMENT pattern - preserve existing API key if placeholder sent
  const apiKey =
    request.apiKey === PASSWORD_REPLACEMENT && existing
      ? existing.apiKey
      : request.apiKey

  const config: WebSearchConfig = {
    _id: configId,
    _rev: existing?._rev,
    provider: request.provider,
    apiKey,
    enabled: request.enabled,
  }

  const { rev } = await db.put(config)
  config._rev = rev
  return config
}

export async function remove(): Promise<void> {
  const db = context.getWorkspaceDB()
  const configId = docIds.getWebSearchConfigID()
  const existing = await db.tryGet<WebSearchConfig>(configId)
  if (existing) {
    await db.remove(existing)
  }
}

/**
 * Sanitize config for frontend - replace API key with placeholder
 */
export function sanitize(
  config: WebSearchConfig | null
): WebSearchConfigResponse | null {
  if (!config || !config._id || !config._rev) return null
  return {
    _id: config._id,
    _rev: config._rev,
    provider: config.provider,
    apiKey: config.apiKey ? PASSWORD_REPLACEMENT : "",
    enabled: config.enabled,
  }
}
