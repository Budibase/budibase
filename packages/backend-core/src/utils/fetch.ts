import { ProxyAgent } from "undici"

/**
 * Creates a fetch dispatcher (ProxyAgent) that respects global-agent environment variables.
 * This is necessary because Node.js's native fetch uses undici which doesn't respect
 * the global-agent proxy configuration.
 *
 * @param options Optional configuration for the ProxyAgent
 * @returns ProxyAgent if proxy is configured, undefined otherwise
 */
function createProxyDispatcher(options?: {
  rejectUnauthorized?: boolean
}): ProxyAgent | boolean {
  const httpProxy =
    process.env.GLOBAL_AGENT_HTTP_PROXY || process.env.HTTP_PROXY
  const httpsProxy =
    process.env.GLOBAL_AGENT_HTTPS_PROXY || process.env.HTTPS_PROXY

  const proxyUrl = httpsProxy || httpProxy

  if (!proxyUrl || !proxyUrl.trim()) {
    return false
  }

  const trimmedProxyUrl = proxyUrl.trim()

  // Validate URL format
  try {
    new URL(trimmedProxyUrl)
  } catch (error) {
    console.log("[fetch] Invalid proxy URL format:", proxyUrl)
    return false
  }

  const rejectUnauthorized =
    options?.rejectUnauthorized !== undefined
      ? options?.rejectUnauthorized
      : true

  console.log("[fetch] Creating ProxyAgent", {
    proxyUrl: trimmedProxyUrl,
    rejectUnauthorized,
  })

  const proxyConfig: {
    uri: string
    requestTls: { rejectUnauthorized?: boolean }
    proxyTls?: { rejectUnauthorized?: boolean }
  } = {
    uri: trimmedProxyUrl,
    requestTls: {
      rejectUnauthorized,
    },
  }

  // Only configure proxyTls if the proxy itself uses HTTPS
  if (trimmedProxyUrl.startsWith("https://")) {
    proxyConfig.proxyTls = {
      rejectUnauthorized,
    }
  }

  try {
    return new ProxyAgent(proxyConfig)
  } catch (error) {
    console.log("[fetch] Failed to create ProxyAgent:", error)
    return false
  }
}

let cachedDispatcher: ProxyAgent | boolean | null = null

/**
 * Get or create a cached proxy dispatcher.
 * The dispatcher is cached to avoid creating a new ProxyAgent for every request.
 *
 * @param options Optional configuration for the ProxyAgent
 */
export function getProxyDispatcher(options?: {
  rejectUnauthorized?: boolean
}): ProxyAgent | boolean {
  // Don't cache if custom options are provided
  if (options) {
    return createProxyDispatcher(options) || false
  }

  if (cachedDispatcher === null) {
    cachedDispatcher = createProxyDispatcher()
  }
  return cachedDispatcher || false
}

/**
 * Reset the cached proxy dispatcher. Used for testing.
 */
export function resetProxyDispatcherCache(): void {
  cachedDispatcher = null
}
