import { Ctx } from "@budibase/types"
import env from "../environment"

const DEFAULT_TRUSTED_PROXY_CIDRS = [
  "127.0.0.0/8",
  "::1/128",
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "169.254.0.0/16",
  "fc00::/7",
  "fe80::/10",
]

// IPv4-mapped IPv6 (::ffff:10.0.0.1) and zone ids (fe80::1%eth0) both show up in
// node socket addresses, and a proxy may append a port.
export const normaliseIp = (value: string): string | undefined => {
  let ip = (value || "").trim()
  if (!ip) {
    return undefined
  }
  // [::1]:1234
  const bracketed = ip.match(/^\[(.+)\](?::\d+)?$/)
  if (bracketed) {
    ip = bracketed[1]
  } else if (ip.split(":").length === 2) {
    // 1.2.3.4:1234 - only strip a port when there is exactly one colon, so we
    // never truncate a bare IPv6 address
    ip = ip.split(":")[0]
  }
  ip = ip.split("%")[0]
  const mapped = ip.match(/^::ffff:((?:\d{1,3}\.){3}\d{1,3})$/i)
  if (mapped) {
    ip = mapped[1]
  }
  return ip.toLowerCase() || undefined
}

const ipv4ToBytes = (ip: string): number[] | undefined => {
  const parts = ip.split(".")
  if (parts.length !== 4) {
    return undefined
  }
  const bytes = parts.map(part => {
    if (!/^\d{1,3}$/.test(part)) {
      return -1
    }
    return Number(part)
  })
  if (bytes.some(byte => byte < 0 || byte > 255)) {
    return undefined
  }
  return bytes
}

const ipv6ToBytes = (ip: string): number[] | undefined => {
  if (!ip.includes(":")) {
    return undefined
  }
  const halves = ip.split("::")
  if (halves.length > 2) {
    return undefined
  }
  const expand = (half: string): number[] | undefined => {
    if (!half) {
      return []
    }
    const groups: number[] = []
    for (const group of half.split(":")) {
      // a trailing IPv4 form, e.g. ::ffff:192.168.0.1
      if (group.includes(".")) {
        const v4 = ipv4ToBytes(group)
        if (!v4) {
          return undefined
        }
        groups.push(...v4)
        continue
      }
      if (!/^[0-9a-f]{1,4}$/.test(group)) {
        return undefined
      }
      const value = parseInt(group, 16)
      groups.push(value >> 8, value & 0xff)
    }
    return groups
  }
  const head = expand(halves[0])
  const tail = expand(halves[1] ?? "")
  if (!head || !tail) {
    return undefined
  }
  if (halves.length === 1) {
    return head.length === 16 ? head : undefined
  }
  const fill = 16 - head.length - tail.length
  if (fill < 0) {
    return undefined
  }
  return [...head, ...new Array(fill).fill(0), ...tail]
}

const toBytes = (ip: string): number[] | undefined =>
  ip.includes(":") ? ipv6ToBytes(ip) : ipv4ToBytes(ip)

interface Cidr {
  bytes: number[]
  prefix: number
}

const parseCidr = (value: string): Cidr | undefined => {
  const parts = (value || "").trim().split("/")
  if (parts.length > 2) {
    return undefined
  }
  const [address, prefixPart] = parts
  const ip = normaliseIp(address)
  if (!ip) {
    return undefined
  }
  const bytes = toBytes(ip)
  if (!bytes) {
    return undefined
  }
  const maxPrefix = bytes.length * 8
  if (prefixPart === undefined) {
    return { bytes, prefix: maxPrefix }
  }
  if (!/^\d+$/.test(prefixPart)) {
    return undefined
  }
  const prefix = Number(prefixPart)
  if (prefix > maxPrefix) {
    return undefined
  }
  return { bytes, prefix }
}

const inCidr = (ip: string, cidr: Cidr): boolean => {
  const bytes = toBytes(ip)
  // never compare an IPv4 address against an IPv6 range, or vice versa
  if (!bytes || bytes.length !== cidr.bytes.length) {
    return false
  }
  let remaining = cidr.prefix
  for (let i = 0; i < bytes.length && remaining > 0; i++) {
    const bits = Math.min(8, remaining)
    const mask = (0xff << (8 - bits)) & 0xff
    if ((bytes[i] & mask) !== (cidr.bytes[i] & mask)) {
      return false
    }
    remaining -= bits
  }
  return true
}

// null means "not parsed yet"; env.TRUSTED_PROXY_CIDRS is string | undefined
let cachedRaw: string | undefined | null = null
let cachedCidrs: Cidr[] = []

const trustedProxyCidrs = (): Cidr[] => {
  const raw = env.TRUSTED_PROXY_CIDRS
  if (raw !== cachedRaw) {
    cachedRaw = raw
    const configured = (raw || "")
      .split(",")
      .map(entry => entry.trim())
      .filter(Boolean)
    const list = configured.length ? configured : DEFAULT_TRUSTED_PROXY_CIDRS
    cachedCidrs = list.reduce((acc: Cidr[], entry) => {
      const cidr = parseCidr(entry)
      if (!cidr) {
        console.warn(`[clientIp] ignoring invalid trusted proxy CIDR: ${entry}`)
        return acc
      }
      acc.push(cidr)
      return acc
    }, [])
  }
  return cachedCidrs
}

export const isTrustedProxy = (value: string): boolean => {
  const ip = normaliseIp(value)
  if (!ip) {
    return false
  }
  return trustedProxyCidrs().some(cidr => inCidr(ip, cidr))
}

const headerValue = (ctx: Ctx, name: string): string | undefined => {
  const header = ctx.request?.headers?.[name]
  const value = Array.isArray(header) ? header[0] : header
  return value?.trim() || undefined
}

/**
 * The address of the client as seen by the outermost proxy we control. Returns
 * undefined when nothing trustworthy can be determined, in which case callers
 * should fall back to a non-IP identifier rather than guessing.
 */
export const getClientIp = (ctx: Ctx): string | undefined => {
  const socketIp = normaliseIp(
    (ctx.req?.socket?.remoteAddress as string | undefined) || ""
  )

  // nothing forwarded to us is worth reading unless one of our own proxies is
  // the thing that forwarded it
  if (!socketIp || !isTrustedProxy(socketIp)) {
    return socketIp
  }

  // the address our own edge saw, so it beats anything derived from the chain
  const realIp = normaliseIp(headerValue(ctx, "x-real-ip") || "")
  if (realIp && toBytes(realIp)) {
    return realIp
  }

  const xff = headerValue(ctx, "x-forwarded-for")
  if (xff) {
    const hops = xff
      .split(",")
      .map(hop => normaliseIp(hop))
      .filter((hop): hop is string => !!hop && !!toBytes(hop))

    // Walk in from the hop nearest to us. Everything we recognise as our own
    // infrastructure is discarded; the first address that is not ours is the
    // closest thing to a real client that we can actually vouch for.
    for (let i = hops.length - 1; i >= 0; i--) {
      if (!isTrustedProxy(hops[i])) {
        return hops[i]
      }
    }

    // Every hop was internal, which happens for cluster-internal traffic.
    if (hops.length) {
      return hops[0]
    }
  }

  return socketIp
}
