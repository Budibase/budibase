import { loadConfig } from "./config"
import { execute } from "./executor"
import {
  PROTOCOL_FIXTURE,
  PROTOCOL_FIXTURE_EXPECTED,
  ExecuteRequest,
} from "./protocol"

const config = loadConfig({})

describe("executor", () => {
  it("runs the protocol fixture end-to-end through the isolate", async () => {
    const response = await execute(PROTOCOL_FIXTURE, config)
    expect(response.status).toBe("ok")
    expect(response.result).toEqual(PROTOCOL_FIXTURE_EXPECTED)
    expect(response.id).toBe(PROTOCOL_FIXTURE.id)
    expect(typeof response.durationMs).toBe("number")
  })

  it("returns a structured error for thrown exceptions", async () => {
    const request: ExecuteRequest = {
      id: "throws",
      code: "throw new Error('boom')",
    }
    const response = await execute(request, config)
    expect(response.status).toBe("error")
    expect(response.error?.message).toContain("boom")
    expect(response.result).toBeUndefined()
  })

  it("reports a timeout for runaway code without hanging", async () => {
    const request: ExecuteRequest = {
      id: "loops",
      code: "while (true) {}",
      limits: { timeoutMs: 100 },
    }
    const response = await execute(request, config)
    expect(response.status).toBe("timeout")
  })

  it("does not expose host globals to isolate code", async () => {
    const request: ExecuteRequest = {
      id: "no-host",
      code: "return typeof process === 'undefined' && typeof require === 'undefined'",
    }
    const response = await execute(request, config)
    expect(response.status).toBe("ok")
    expect(response.result).toBe(true)
  })
})
