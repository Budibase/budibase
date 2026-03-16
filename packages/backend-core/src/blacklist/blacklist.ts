import dns from "dns"
import net from "net"
import env from "../environment"
import { promisify } from "util"

const DEFAULT_BLACKLIST = [
  "127.0.0.0/8",
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "169.254.0.0/16",
  "0.0.0.0/8",
  "::1/128",
  "fc00::/7",
  "fe80::/10",
] as const

let blackList: net.BlockList | undefined
const performLookup = promisify(dns.lookup)

function shouldApplyDefaultBlacklist() {
  return !(env.SELF_HOSTED && env.BLACKLIST_IPS !== undefined)
}

function getIpVersion(address: string): "ipv4" | "ipv6" {
  return net.isIP(address) === 6 ? "ipv6" : "ipv4"
}

function getMaxPrefixLength(address: string): number | null {
  const ipVersion = net.isIP(address)
  if (ipVersion === 4) {
    return 32
  }
  if (ipVersion === 6) {
    return 128
  }
  return null
}

function getValidSubnetPrefix(address: string, prefix: string): number | null {
  if (!/^\d+$/.test(prefix)) {
    return null
  }

  const parsedPrefix = Number.parseInt(prefix, 10)
  const maxPrefixLength = getMaxPrefixLength(address)
  if (maxPrefixLength == null || parsedPrefix > maxPrefixLength) {
    return null
  }

  return parsedPrefix
}

function parseAddress(address: string) {
  if (net.isIP(address)) {
    return address
  }
  if (!address.startsWith("http")) {
    address = `https://${address}`
  }
  return new URL(address).hostname.replace(/^\[|\]$/g, "")
}

async function lookup(address: string): Promise<string[]> {
  address = parseAddress(address)
  const addresses = await performLookup(address, {
    all: true,
  })
  return addresses.map(addr => addr.address)
}

function addEntryToBlacklist(blockList: net.BlockList, entry: string) {
  const trimmed = entry.trim()
  if (!trimmed) {
    return
  }

  const segments = trimmed.split("/")
  if (segments.length > 2) {
    console.log(`Ignoring invalid blacklist entry: ${trimmed}`)
    return
  }

  const [ip, prefix] = segments
  const parsedIp = net.isIP(ip)
  if (segments.length === 2) {
    const parsedPrefix = getValidSubnetPrefix(ip, prefix)
    if (parsedIp && parsedPrefix !== null) {
      blockList.addSubnet(ip, parsedPrefix, getIpVersion(ip))
      return
    }

    console.log(`Ignoring invalid blacklist entry: ${trimmed}`)
    return
  }

  if (parsedIp) {
    blockList.addAddress(ip, getIpVersion(ip))
  }
}

export async function refreshBlacklist() {
  const next = new net.BlockList()
  if (shouldApplyDefaultBlacklist()) {
    for (const entry of DEFAULT_BLACKLIST) {
      addEntryToBlacklist(next, entry)
    }
  }

  const configuredBlacklist = env.BLACKLIST_IPS?.split(",") || []
  for (const entry of configuredBlacklist) {
    const trimmed = entry.trim()
    if (!trimmed) {
      continue
    }

    const [ip] = trimmed.split("/")
    if (net.isIP(ip)) {
      addEntryToBlacklist(next, trimmed)
      continue
    }

    const addresses = await lookup(trimmed)
    for (const address of addresses) {
      addEntryToBlacklist(next, address)
    }
  }

  blackList = next
}

export async function isBlacklisted(address: string): Promise<boolean> {
  if (!blackList) {
    await refreshBlacklist()
  }

  let ips: string[]
  if (!net.isIP(address)) {
    try {
      ips = await lookup(address)
    } catch {
      return shouldApplyDefaultBlacklist()
    }
  } else {
    ips = [address]
  }
  return ips.some(ip => blackList!.check(ip, getIpVersion(ip)))
}
