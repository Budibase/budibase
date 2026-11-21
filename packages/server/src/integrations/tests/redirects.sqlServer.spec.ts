import { blacklist, setEnv as setCoreEnv } from "@budibase/backend-core"
import net from "net"
import sqlServer, { connectToSafeHost } from "../microsoftSqlServer"
import { type Listener, listen, startInternalListener } from "./utils/outbound"

// A datasource can point at a SQL Server the user controls. That server passes
// the host check, then answers the login with a routing redirect to an internal
// address. These tests stand in for both: the user's server listens on
// 127.0.0.1, which is allowed here, and the internal address is ::1, which is
// blocked.

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(
    parts.reduce((total, part) => total + part.length, 0)
  )
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

const bytes = (...values: number[]) => new Uint8Array(values)
const uint16LE = (value: number) => bytes(value & 0xff, value >> 8)
const uint16BE = (value: number) => bytes(value >> 8, value & 0xff)
const ucs2 = (value: string) => new Uint8Array(Buffer.from(value, "ucs2"))

const TDS_PRELOGIN = 0x12
const TDS_LOGIN7 = 0x10
const TDS_RESPONSE = 0x04

function tdsPacket(payload: Uint8Array) {
  return concat(
    // type, end of message, length, SPID, packet id, window
    bytes(TDS_RESPONSE, 0x01),
    uint16BE(8 + payload.length),
    bytes(0, 0, 1, 0),
    payload
  )
}

// Says encryption is not supported, so the login runs without TLS.
function preloginResponse() {
  const options = [
    { token: 0x00, data: bytes(16, 0, 0, 0, 0, 0) }, // version
    { token: 0x01, data: bytes(0x02) }, // encryption: not supported
    { token: 0x02, data: bytes(0x00) }, // instance
    { token: 0x04, data: bytes(0x00) }, // MARS off
  ]
  let dataOffset = options.length * 5 + 1
  const header = options.map(({ token, data }) => {
    const entry = concat(
      bytes(token),
      uint16BE(dataOffset),
      uint16BE(data.length)
    )
    dataOffset += data.length
    return entry
  })
  return concat(...header, bytes(0xff), ...options.map(({ data }) => data))
}

// A successful login whose reply tells the client to reconnect to `target`,
// the way Azure SQL's gateway routes a client to the database node.
function loginWithRoutingRedirect(target: { host: string; port: number }) {
  const programName = ucs2("fake")
  const loginAck = concat(
    bytes(0x01), // T-SQL interface
    bytes(0x74, 0x00, 0x00, 0x04), // TDS 7.4
    bytes(programName.length / 2),
    programName,
    bytes(16, 0, 0, 0)
  )
  const route = concat(
    bytes(0x00), // TCP
    uint16LE(target.port),
    uint16LE(target.host.length),
    ucs2(target.host)
  )
  const routing = concat(
    bytes(20), // routing change
    uint16LE(route.length),
    route,
    uint16LE(0)
  )
  return concat(
    bytes(0xad),
    uint16LE(loginAck.length),
    loginAck,
    bytes(0xe3),
    uint16LE(routing.length),
    routing,
    bytes(0xfd),
    new Uint8Array(12) // done: final, no rows
  )
}

async function startRedirectingSqlServer(target: {
  host: string
  port: number
}) {
  let logins = 0
  const server = net.createServer(socket => {
    let buffer: Uint8Array = new Uint8Array(0)
    const packetLength = () => (buffer[2] << 8) | buffer[3]
    socket.on("error", () => {})
    socket.on("data", chunk => {
      buffer = concat(buffer, new Uint8Array(chunk))
      while (buffer.length >= 8 && buffer.length >= packetLength()) {
        const type = buffer[0]
        buffer = buffer.subarray(packetLength())
        if (type === TDS_PRELOGIN) {
          socket.write(tdsPacket(preloginResponse()))
        } else if (type === TDS_LOGIN7) {
          logins++
          socket.write(tdsPacket(loginWithRoutingRedirect(target)))
        }
      }
    })
  })
  const { port, close } = await listen(server, "127.0.0.1")
  return { port, logins: () => logins, close }
}

describe("SQL Server and routing redirects", () => {
  let internal: Listener
  let tds: Awaited<ReturnType<typeof startRedirectingSqlServer>>
  let resetBlacklistEnv: () => void

  beforeAll(async () => {
    resetBlacklistEnv = setCoreEnv({ BLACKLIST_IPS: "::1" })
    await blacklist.refreshBlacklist()
    internal = await startInternalListener()
    tds = await startRedirectingSqlServer({
      host: "::1",
      port: internal.port,
    })
  })

  afterAll(async () => {
    await tds.close()
    await internal.close()
    resetBlacklistEnv()
    await blacklist.refreshBlacklist()
  })

  const connect = () =>
    new sqlServer.integration({
      server: "127.0.0.1",
      port: tds.port,
      user: "user",
      password: "password",
      database: "master",
      schema: "dbo",
    }).testConnection()

  it("does not follow a routing redirect to a blocked host", async () => {
    const logins = tds.logins()
    const before = internal.connections()

    const response = await connect()

    expect(tds.logins()).toBe(logins + 1)
    expect(response.error).toContain("Host is blocked")
    expect(internal.connections()).toBe(before)
  })

  // Shows the driver hands the redirected host to the guarded connector:
  // with the blacklist off, the reconnect lands on the internal address.
  it("follows the routing redirect when the host is allowed", async () => {
    const reset = setCoreEnv({ BLACKLIST_IPS: "" })
    await blacklist.refreshBlacklist()
    const before = internal.connections()

    await connect()

    reset()
    await blacklist.refreshBlacklist()
    expect(internal.connections()).toBe(before + 1)
  })

  it("does not open a socket when the driver aborts during the host check", async () => {
    const netConnect = jest.spyOn(net, "connect")
    const controller = new AbortController()

    const pending = connectToSafeHost({
      host: "127.0.0.1",
      port: tds.port,
      signal: controller.signal,
    })
    controller.abort()

    await expect(pending).rejects.toThrow("Connection aborted")
    expect(netConnect).not.toHaveBeenCalled()
    netConnect.mockRestore()
  })
})
