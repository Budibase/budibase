import { Agent, ProxyAgent, Dispatcher } from "undici"

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
 * Determines if the request should bypass the proxy.
 *
 * @param url The target URL
 * @returns true if the request should go direct (no proxy)
 */
function shouldBypassProxy(url?: string): boolean {
  const httpProxy =
    process.env.GLOBAL_AGENT_HTTP_PROXY || process.env.HTTP_PROXY
  const httpsProxy =
    process.env.GLOBAL_AGENT_HTTPS_PROXY || process.env.HTTPS_PROXY

  const proxyUrl = httpsProxy || httpProxy

  // No proxy configured
  if (!proxyUrl || !proxyUrl.trim()) {
    return true
  }

  // Validate proxy URL format
  try {
    new URL(proxyUrl.trim())
  } catch {
    console.log("[fetch] Invalid proxy URL format:", proxyUrl)
    return true
  }

  // Check NO_PROXY patterns
  if (url) {
    const noProxy =
      process.env.GLOBAL_AGENT_NO_PROXY || process.env.NO_PROXY || ""
    if (noProxy && isUrlMatchingNoProxy(url, noProxy)) {
      console.log("[fetch] URL matches NO_PROXY pattern, bypassing proxy", {
        url,
        noProxy,
      })
      return true
    }
  }

  return false
}

/**
 * Creates a direct Agent (no proxy).
 */
function createDirectAgent(rejectUnauthorized: boolean): Agent {
  return new Agent({
    connect: {
      rejectUnauthorized,
    },
  })
}

/**
 * Creates a ProxyAgent for proxied requests.
 */
function createProxyAgent(rejectUnauthorized: boolean): ProxyAgent {
  const httpProxy =
    process.env.GLOBAL_AGENT_HTTP_PROXY || process.env.HTTP_PROXY
  const httpsProxy =
    process.env.GLOBAL_AGENT_HTTPS_PROXY || process.env.HTTPS_PROXY

  const proxyUrl = (httpsProxy || httpProxy)!.trim()

  console.log("[fetch] Creating ProxyAgent", {
    proxyUrl,
    rejectUnauthorized,
  })

  const proxyConfig: {
    uri: string
    requestTls: { rejectUnauthorized?: boolean }
    proxyTls?: { rejectUnauthorized?: boolean }
  } = {
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

/**
 * Creates a fetch dispatcher that respects global-agent environment variables.
 * Always returns a usable Dispatcher - either a ProxyAgent or a direct Agent.
 *
 * @param options Configuration for the dispatcher
 * @returns A Dispatcher (ProxyAgent for proxied requests, Agent for direct requests)
 */
function createDispatcher(options?: {
  rejectUnauthorized?: boolean
  url?: string
}): Dispatcher {
  const rejectUnauthorized = options?.rejectUnauthorized ?? true

  if (shouldBypassProxy(options?.url)) {
    return createDirectAgent(rejectUnauthorized)
  }

  return createProxyAgent(rejectUnauthorized)
}

/**
 * Get a dispatcher for fetch requests.
 * Always returns a usable Dispatcher - either a ProxyAgent or a direct Agent.
 * The dispatcher respects GLOBAL_AGENT_HTTP_PROXY, GLOBAL_AGENT_HTTPS_PROXY,
 * GLOBAL_AGENT_NO_PROXY, and their standard equivalents.
 *
 * @param options Configuration for the dispatcher
 * @returns A Dispatcher ready to use with fetch
 */
export function getDispatcher(options: {
  rejectUnauthorized?: boolean
  url: string
}): Dispatcher {
  return createDispatcher(options)
}
