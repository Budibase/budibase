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
}): ProxyAgent | undefined {
  const httpProxy =
    process.env.GLOBAL_AGENT_HTTP_PROXY || process.env.HTTP_PROXY
  const httpsProxy =
    process.env.GLOBAL_AGENT_HTTPS_PROXY || process.env.HTTPS_PROXY

  const proxyUrl = httpsProxy || httpProxy

  if (!proxyUrl) {
    return undefined
  }

  const rejectUnauthorized = options?.rejectUnauthorized

  console.log("[fetch] Creating ProxyAgent", {
    proxyUrl,
    rejectUnauthorized,
  })

  const proxyConfig: any = {
    uri: proxyUrl,
    requestTls: {
      rejectUnauthorized,
    },
  }

  // Only configure proxyTls if the proxy itself uses HTTPS
  if (proxyUrl.startsWith("https://")) {
    proxyConfig.proxyTls = {
      rejectUnauthorized,
    }
  }

  return new ProxyAgent(proxyConfig)
}

let cachedDispatcher: ProxyAgent | undefined | null = null

/**
 * Get or create a cached proxy dispatcher.
 * The dispatcher is cached to avoid creating a new ProxyAgent for every request.
 *
 * @param options Optional configuration for the ProxyAgent
 */
export function getProxyDispatcher(options?: {
  rejectUnauthorized?: boolean
}): ProxyAgent | undefined {
  // Don't cache if custom options are provided
  if (options) {
    return createProxyDispatcher(options)
  }

  if (cachedDispatcher === null) {
    cachedDispatcher = createProxyDispatcher()
  }
  return cachedDispatcher || undefined
}
