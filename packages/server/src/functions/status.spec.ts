import { getFunctionRunnerStatus } from "./status"

describe("Function runner status", () => {
  it("reports disabled when no runner is configured", async () => {
    await expect(getFunctionRunnerStatus({ baseUrl: "" })).resolves.toBe(
      "disabled"
    )
  })

  it("reports healthy only for a valid healthy response", async () => {
    const fetch = jest.fn(async () =>
      Promise.resolve(
        new Response(JSON.stringify({ healthy: true }), { status: 200 })
      )
    )

    await expect(
      getFunctionRunnerStatus({ baseUrl: "http://example.com", fetch })
    ).resolves.toBe("healthy")
  })

  it("reports busy for admission saturation", async () => {
    const fetch = jest.fn(async () =>
      Promise.resolve(new Response(null, { status: 429 }))
    )

    await expect(
      getFunctionRunnerStatus({ baseUrl: "http://example.com", fetch })
    ).resolves.toBe("busy")
  })

  it("reports unhealthy for failures and invalid responses", async () => {
    const invalidResponse = jest.fn(async () =>
      Promise.resolve(
        new Response(JSON.stringify({ healthy: false }), { status: 200 })
      )
    )
    await expect(
      getFunctionRunnerStatus({
        baseUrl: "http://example.com",
        fetch: invalidResponse,
      })
    ).resolves.toBe("unhealthy")

    const unavailable = jest.fn(async () => {
      throw new Error("Runner unavailable")
    })
    await expect(
      getFunctionRunnerStatus({
        baseUrl: "http://example.com",
        fetch: unavailable,
      })
    ).resolves.toBe("unhealthy")
  })
})
