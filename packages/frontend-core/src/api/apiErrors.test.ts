// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { createAPIClient } from "."
import { APIError } from "./types"

const respondWith = ({
  status,
  body,
  headers = {},
}: {
  status: number
  body: unknown
  headers?: Record<string, string>
}) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(body), { status, headers }))
  )
}

const post = async (): Promise<APIError> => {
  try {
    await createAPIClient().post({ url: "/api/global/auth/tenant/login" })
    throw new Error("expected the call to reject")
  } catch (error) {
    return error as APIError
  }
}

describe("API error handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("replaces the generic retry wording with the actual window for a rate limited request", async () => {
    respondWith({
      status: 429,
      body: { message: "Too many login attempts. Try again later." },
      headers: { "Retry-After": "900" },
    })

    const error = await post()

    expect(error.status).toBe(429)
    expect(error.accountLocked).toBe(false)
    expect(error.message).toBe(
      "Too many login attempts. Try again in 15 minutes."
    )
  })

  it("appends the retry window when the server message has no generic retry wording to replace", async () => {
    respondWith({
      status: 429,
      body: { message: "Too many requests" },
      headers: { "Retry-After": "900" },
    })

    const error = await post()

    expect(error.message).toBe("Too many requests Try again in 15 minutes.")
  })

  it("does not invent a retry window when Retry-After is absent", async () => {
    respondWith({
      status: 429,
      body: { message: "Too many login attempts. Try again later." },
    })

    const error = await post()

    expect(error.message).toBe("Too many login attempts. Try again later.")
  })

  it("flags a locked account and reports the window", async () => {
    respondWith({
      status: 403,
      body: { message: "Account temporarily locked. Try again later." },
      headers: { "X-Account-Locked": "1", "Retry-After": "900" },
    })

    const error = await post()

    expect(error.accountLocked).toBe(true)
    expect(error.message).toBe(
      "Account temporarily locked. Try again in 15 minutes."
    )
  })

  it("does not flag a plain credential rejection", async () => {
    respondWith({ status: 403, body: { message: "Invalid credentials" } })

    const error = await post()

    expect(error.status).toBe(403)
    expect(error.accountLocked).toBe(false)
    expect(error.message).toBe("Invalid credentials")
  })

  it("uses seconds when the window is under a minute", async () => {
    respondWith({
      status: 403,
      body: { message: "Account temporarily locked." },
      headers: { "X-Account-Locked": "1", "Retry-After": "1" },
    })

    const error = await post()

    expect(error.message).toBe(
      "Account temporarily locked. Try again in 1 second."
    )
  })
})
