import {
  FUNCTION_RUN_REQUEST_FIXTURE,
  FunctionErrorCode,
} from "@budibase/types"
import { spawn } from "node:child_process"
import type { AddressInfo } from "node:net"
import { createServer } from "./server"
import { FunctionSupervisor } from "./supervisor"

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

  it("rejects an oversized request without buffering it unboundedly", async () => {
    const server = createServer()
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve))

    try {
      const address = server.address() as AddressInfo
      const response = await fetch(`http://127.0.0.1:${address.port}/runs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "x".repeat(2 * 1024 * 1024 + 1),
      })

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({
        error: {
          code: FunctionErrorCode.FUNCTION_PROTOCOL_ERROR,
          message: "Function run request is too large",
        },
      })
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
    }
  })
})
