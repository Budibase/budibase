import { FunctionErrorCode } from "@budibase/types"
import { spawn } from "node:child_process"
import net from "node:net"
import type { AddressInfo } from "node:net"
import { createServer } from "./server"
import { FunctionSupervisor } from "./supervisor"
import { FUNCTION_RUN_REQUEST_FIXTURE } from "./testFixtures"

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

  it("stays healthy after an invocation child crashes", async () => {
    const supervisor = new FunctionSupervisor({
      childFactory: () =>
        spawn(process.execPath, ["-e", "process.exit(2)"], {
          stdio: ["ignore", "ignore", "ignore", "ipc"],
        }),
    })
    const server = createServer(supervisor)
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))

    try {
      const address = server.address() as AddressInfo
      const runResponse = await fetch(`http://127.0.0.1:${address.port}/runs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...FUNCTION_RUN_REQUEST_FIXTURE,
          runId: "run-crash-health",
        }),
      })
      const healthResponse = await fetch(
        `http://127.0.0.1:${address.port}/health`
      )

      expect(await runResponse.json()).toMatchObject({
        status: "error",
        error: { code: FunctionErrorCode.FUNCTION_RUNTIME_ERROR },
      })
      expect(healthResponse.status).toBe(200)
      expect(await healthResponse.json()).toEqual({ healthy: true })
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
    }
  })

  it("closes the connection when a request exceeds the body limit", async () => {
    const server = createServer()
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))
    const address = server.address() as AddressInfo
    const socket = net.createConnection(address.port, "127.0.0.1")

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Oversized request connection remained open")),
          1_000
        )
        socket.once("close", () => {
          clearTimeout(timeout)
          resolve()
        })
        socket.once("error", () => {})
        socket.once("connect", () => {
          const chunk = Buffer.alloc(2 * 1024 * 1024 + 1)
          socket.write(
            "POST /runs HTTP/1.1\r\n" +
              "Host: example.com\r\n" +
              "Transfer-Encoding: chunked\r\n\r\n" +
              `${chunk.length.toString(16)}\r\n`
          )
          socket.write(chunk)
          socket.write("\r\n")
        })
      })

      expect(socket.destroyed).toBe(true)
    } finally {
      socket.destroy()
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
    }
  })

  it("ignores query parameters when cancelling a run", async () => {
    const supervisor = new FunctionSupervisor()
    const terminate = jest.spyOn(supervisor, "terminate")
    const server = createServer(supervisor)
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))

    try {
      const address = server.address() as AddressInfo
      const response = await fetch(
        `http://127.0.0.1:${address.port}/runs/run-to-cancel?source=example.com`,
        { method: "DELETE" }
      )

      expect(response.status).toBe(202)
      expect(await response.json()).toEqual({ terminated: true })
      expect(terminate).toHaveBeenCalledWith("run-to-cancel")
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
    }
  })
})
