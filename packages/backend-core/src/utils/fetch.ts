import { ProxyAgent } from "undici"

/**
 * Creates a fetch dispatcher (ProxyAgent) that respects global-agent environment variables.
 * This is necessary because Node.js's native fetch uses undici which doesn't respect
 * the global-agent proxy configuration.
 *
 * @returns ProxyAgent if proxy is configured, undefined otherwise
 */
function createProxyDispatcher(): ProxyAgent | undefined {
  const httpProxy =
    process.env.GLOBAL_AGENT_HTTP_PROXY || process.env.HTTP_PROXY
  const httpsProxy =
    process.env.GLOBAL_AGENT_HTTPS_PROXY || process.env.HTTPS_PROXY

  const proxyUrl = httpsProxy || httpProxy

  if (!proxyUrl) {
    return undefined
  }

  console.log("[fetch] Creating ProxyAgent", {
    proxyUrl,
  })

  return new ProxyAgent({
    uri: proxyUrl,
  })
}

let cachedDispatcher: ProxyAgent | undefined | null = null

/**
 * Get or create a cached proxy dispatcher.
 * The dispatcher is cached to avoid creating a new ProxyAgent for every request.
 */
export function getProxyDispatcher(): ProxyAgent | undefined {
  if (cachedDispatcher === null) {
    cachedDispatcher = createProxyDispatcher()
  }
  return cachedDispatcher || undefined
}
