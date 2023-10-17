import dns from "dns"
import net from "net"
import env from "../environment"
import { promisify } from "util"

let blackListArray: string[] | undefined
const performLookup = promisify(dns.lookup)

async function lookup(address: string): Promise<string[]> {
  if (!net.isIP(address)) {
    // need this for URL parsing simply
    if (!address.startsWith("http")) {
      address = `https://${address}`
    }
    address = new URL(address).hostname
  }
  const addresses = await performLookup(address, {
    all: true,
  })
  return addresses.map(addr => addr.address)
}

export async function refreshBlacklist() {
  const blacklist = env.BLACKLIST_IPS
  const list = blacklist?.split(",") || []
  let final: string[] = []
  for (let addr of list) {
    const trimmed = addr.trim()
    if (!net.isIP(trimmed)) {
      const addresses = await lookup(trimmed)
      final = final.concat(addresses)
    } else {
      final.push(trimmed)
    }
  }
  blackListArray = final
}

export async function isBlacklisted(address: string): Promise<boolean> {
  if (!blackListArray) {
    await refreshBlacklist()
  }
  if (blackListArray?.length === 0) {
    return false
  }
  // no need for DNS
  let ips: string[]
  if (!net.isIP(address)) {
    ips = await lookup(address)
  } else {
    ips = [address]
  }
  return !!blackListArray?.find(addr => ips.includes(addr))
}
