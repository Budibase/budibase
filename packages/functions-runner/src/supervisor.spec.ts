import http from "http"
import { AddressInfo } from "net"
import { loadConfig } from "./config"
import { createServer } from "./supervisor"
import { PROTOCOL_FIXTURE, PROTOCOL_FIXTURE_EXPECTED } from "./protocol"

const request = (
  server: http.Server,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; json: any }> => {
  const { port } = server.address() as AddressInfo
  return new Promise((resolve, reject) => {
    const payload = body !== undefined ? JSON.stringify(body) : undefined
    const req = http.request(
      { host: "127.0.0.1", port, method, path },
      res => {
        const chunks: Buffer[] = []
        res.on("data", c => chunks.push(c))
        res.on("end", () =>
          resolve({
            status: res.statusCode || 0,
            json: JSON.parse(Buffer.concat(chunks).toString("utf8")),
          })
        )
      }
    )
    req.on("error", reject)
    if (payload) req.write(payload)
    req.end()
  })
}

describe("supervisor http server", () => {
  let server: http.Server

  beforeAll(done => {
    server = createServer(loadConfig({}))
    server.listen(0, "127.0.0.1", done)
  })

  afterAll(done => {
    server.close(() => done())
  })

  it("reports health", async () => {
    const res = await request(server, "GET", "/health")
    expect(res.status).toBe(200)
    expect(res.json.status).toBe("ok")
    expect(res.json.service).toBe("functions-runner")
  })

  it("executes the protocol fixture over http", async () => {
    const res = await request(server, "POST", "/execute", PROTOCOL_FIXTURE)
    expect(res.status).toBe(200)
    expect(res.json.status).toBe("ok")
    expect(res.json.result).toEqual(PROTOCOL_FIXTURE_EXPECTED)
  })

  it("rejects malformed execute requests", async () => {
    const res = await request(server, "POST", "/execute", { nope: true })
    expect(res.status).toBe(400)
  })
})
