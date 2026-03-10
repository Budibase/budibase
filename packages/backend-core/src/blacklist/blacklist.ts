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

function getIpVersion(address: string): "ipv4" | "ipv6" {
  return net.isIP(address) === 6 ? "ipv6" : "ipv4"
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

  const [ip, prefix] = trimmed.split("/")
  const parsedIp = net.isIP(ip)
  const parsedPrefix = prefix ? parseInt(prefix, 10) : null
  if (
    prefix &&
    parsedIp &&
    parsedPrefix !== null &&
    !Number.isNaN(parsedPrefix)
  ) {
    blockList.addSubnet(ip, parsedPrefix, getIpVersion(ip))
    return
  }

  if (parsedIp) {
    blockList.addAddress(ip, getIpVersion(ip))
  }
}

export async function refreshBlacklist() {
  const next = new net.BlockList()
  for (const entry of DEFAULT_BLACKLIST) {
    addEntryToBlacklist(next, entry)
  }

  const configuredBlacklist = env.BLACKLIST_IPS?.split(",") || []
  for (const entry of configuredBlacklist) {
    const trimmed = entry.trim()
    if (!trimmed) {
      continue
    }

    const [ip, prefix] = trimmed.split("/")
    if (net.isIP(ip) && prefix && !Number.isNaN(parseInt(prefix, 10))) {
      addEntryToBlacklist(next, trimmed)
      continue
    }

    if (net.isIP(trimmed)) {
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
      return false
    }
  } else {
    ips = [address]
  }
  return ips.some(ip => blackList!.check(ip, getIpVersion(ip)))
}
