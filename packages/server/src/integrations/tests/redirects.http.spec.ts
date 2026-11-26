import { blacklist, setEnv as setCoreEnv } from "@budibase/backend-core"
import http from "http"
import couchdb from "../couchdb"
import dynamodb from "../dynamodb"
import elasticsearch from "../elasticsearch"
import s3 from "../s3"
import { type Listener, listen, startInternalListener } from "./utils/outbound"

// A datasource can point at a server the user controls. That server passes
// the host check, then answers with a redirect to an internal address. These
// tests stand in for both: the user's server listens on 127.0.0.1, which is
// allowed here, and the internal address is ::1, which is blocked.

type Responder = (res: http.ServerResponse) => void

async function startRedirectingServer() {
  let requests = 0
  let respond: Responder = res => res.end()
  const server = http.createServer((req, res) => {
    requests++
    req.resume()
    respond(res)
  })
  const { port, close } = await listen(server, "127.0.0.1")
  return {
    url: `http://127.0.0.1:${port}`,
    requests: () => requests,
    respondWith: (responder: Responder) => {
      requests = 0
      respond = responder
    },
    close,
  }
}

const STATUSES = [301, 302, 303, 307, 308]

describe("HTTP datasource connectors and redirects", () => {
  let internal: Listener
  let redirecting: Awaited<ReturnType<typeof startRedirectingServer>>
  let resetBlacklistEnv: () => void

  beforeAll(async () => {
    resetBlacklistEnv = setCoreEnv({ BLACKLIST_IPS: "::1" })
    await blacklist.refreshBlacklist()
    internal = await startInternalListener()
    redirecting = await startRedirectingServer()
  })

  afterAll(async () => {
    await redirecting.close()
    await internal.close()
    resetBlacklistEnv()
    await blacklist.refreshBlacklist()
  })

  const internalUrl = () => `http://[::1]:${internal.port}/`

  const redirectWith = (status: number) =>
    redirecting.respondWith(res => {
      res.writeHead(status, { location: internalUrl() })
      res.end()
    })

  const connectors = {
    CouchDB: () =>
      new couchdb.integration({
        url: redirecting.url.replace("://", "://user:pass@"),
        database: "test",
      }),
    Elasticsearch: () =>
      new elasticsearch.integration({ url: redirecting.url }),
    S3: () =>
      new s3.integration({
        region: "us-east-1",
        accessKeyId: "key",
        secretAccessKey: "secret",
        s3ForcePathStyle: true,
        endpoint: redirecting.url,
      }),
    DynamoDB: () =>
      new dynamodb.integration({
        region: "us-east-1",
        accessKeyId: "key",
        secretAccessKey: "secret",
        endpoint: redirecting.url,
      }),
  }

  // Shows the tests below would catch a client that follows the redirect.
  it("detects a client that follows the redirect", async () => {
    redirectWith(302)
    const before = internal.connections()

    await fetch(redirecting.url).catch(() => undefined)

    expect(internal.connections()).toBe(before + 1)
  })

  describe.each(Object.entries(connectors))("%s", (_name, create) => {
    it.each(STATUSES)("does not follow a %s redirect", async status => {
      redirectWith(status)
      const before = internal.connections()

      await create().testConnection()

      expect(redirecting.requests()).toBeGreaterThan(0)
      expect(internal.connections()).toBe(before)
    })
  })

  it("S3 does not follow a region redirect", async () => {
    redirecting.respondWith(res => {
      res.writeHead(301, {
        "content-type": "application/xml",
        "x-amz-bucket-region": "eu-west-1",
        location: internalUrl(),
      })
      res.end(
        `<?xml version="1.0" encoding="UTF-8"?><Error><Code>PermanentRedirect</Code><Message>Use the specified endpoint.</Message><Endpoint>[::1]:${internal.port}</Endpoint></Error>`
      )
    })
    const before = internal.connections()

    await connectors.S3().testConnection()

    expect(redirecting.requests()).toBeGreaterThan(0)
    expect(internal.connections()).toBe(before)
  })
})
