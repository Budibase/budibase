import http from "http"
import https from "https"
import { utils } from "@budibase/backend-core"

// For AWS clients given a custom endpoint: the endpoint host is checked and
// every connection goes to the checked IP, so the SDK cannot resolve it again.
export async function pinnedRequestHandler(endpoint: string) {
  const { hostname } = new URL(endpoint)
  const ip = await utils.resolveSafeHostIp(hostname.replace(/^\[|\]$/g, ""))
  const lookup = utils.createPinnedLookup(ip)
  return {
    httpAgent: new http.Agent({ keepAlive: true, lookup }),
    httpsAgent: new https.Agent({ keepAlive: true, lookup }),
  }
}
