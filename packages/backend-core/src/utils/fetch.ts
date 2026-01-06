import { ProxyAgent } from "undici"

/**
 * Check if a URL matches any pattern in the NO_PROXY list.
 * Supports patterns like: *.foo.com, baz.com, .example.com
 *
 * @param url The URL to check
 * @param noProxy Comma or space separated list of NO_PROXY patterns
 * @returns true if the URL should bypass the proxy
 */
function isUrlMatchingNoProxy(url: string, noProxy: string): boolean {
  let hostname: string
  let port: string | null = null

  try {
    const parsed = new URL(url)
    hostname = parsed.hostname
    port = parsed.port || null
  } catch {
    return false
  }

  const rules = noProxy.split(/[\s,]+/).filter(r => r.length > 0)

  for (const rule of rules) {
    // Handle leading dot (e.g., .foo.com) by converting to wildcard
    const normalizedRule = rule.replace(/^\./, "*")

    // Parse rule into hostname and optional port
    // Match: hostname optionally followed by :port
    const ruleMatch = normalizedRule.match(/^(.+?)(?::(\d+))?$/)
    if (!ruleMatch || !ruleMatch[1]) {
      continue
    }

    const ruleHostname = ruleMatch[1].toLowerCase()
    const rulePort = ruleMatch[2] || null

    // Check hostname match (supports wildcards like *.foo.com)
    let hostnameMatches = false
    if (ruleHostname === "*") {
      hostnameMatches = true
    } else if (ruleHostname.startsWith("*")) {
      // Wildcard pattern like *.foo.com
      const suffix = ruleHostname.slice(1) // .foo.com
      hostnameMatches =
        hostname === suffix.slice(1) || hostname.endsWith(suffix)
    } else {
      hostnameMatches = hostname === ruleHostname
    }

    // Check port match (if rule specifies a port)
    const portMatches = !rulePort || port === rulePort

    if (hostnameMatches && portMatches) {
      return true
    }
  }

  return false
}

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
  url?: string
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

  // Check NO_PROXY patterns
  const noProxy =
    process.env.GLOBAL_AGENT_NO_PROXY || process.env.NO_PROXY || ""
  if (options?.url && noProxy && isUrlMatchingNoProxy(options.url, noProxy)) {
    console.log("[fetch] URL matches NO_PROXY pattern, bypassing proxy", {
      url: options.url,
      noProxy,
    })
    return false
  }

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
 * The dispatcher is cached to avoid creating a new ProxyAgent for every request,
 * but only when no URL is provided (since NO_PROXY matching requires the URL).
 *
 * @param options Optional configuration for the ProxyAgent
 */
export function getProxyDispatcher(options?: {
  rejectUnauthorized?: boolean
  url?: string
}): ProxyAgent | boolean {
  // Don't cache if custom options are provided (including url for NO_PROXY checking)
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
