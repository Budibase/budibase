import type { AddressInfo } from "node:net"
import { createServer } from "./server"

describe("Functions runner service", () => {
  it("reports its health", async () => {
    const server = createServer()
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))

    try {
      const address = server.address() as AddressInfo
      const healthResponse = await fetch(
        `http://127.0.0.1:${address.port}/health`
      )
      expect(healthResponse.status).toBe(200)
      expect(await healthResponse.json()).toEqual({
        healthy: true,
      })
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
    }
  })
})
