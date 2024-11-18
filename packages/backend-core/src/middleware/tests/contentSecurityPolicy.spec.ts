import crypto from "crypto"
import contentSecurityPolicy from "../contentSecurityPolicy"

jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
  randomUUID: jest.fn(),
}))

describe("contentSecurityPolicy middleware", () => {
  let ctx: any
  let next: any
  const mockNonce = "mocked/nonce"

  beforeEach(() => {
    ctx = {
      state: {},
      set: jest.fn(),
    }
    next = jest.fn()
    // @ts-ignore
    crypto.randomBytes.mockReturnValue(Buffer.from(mockNonce, "base64"))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should generate a nonce and set it in the script-src directive", async () => {
    await contentSecurityPolicy(ctx, next)

    expect(ctx.state.nonce).toBe(mockNonce)
    expect(ctx.set).toHaveBeenCalledWith(
      "Content-Security-Policy",
      expect.stringContaining(
        `script-src 'self' 'unsafe-eval' https://*.budibase.net https://cdn.budi.live https://js.intercomcdn.com https://widget.intercom.io https://d2l5prqdbvm3op.cloudfront.net https://us-assets.i.posthog.com 'nonce-${mockNonce}'`
      )
    )
    expect(next).toHaveBeenCalled()
  })

  it("should include all CSP directives in the header", async () => {
    await contentSecurityPolicy(ctx, next)

    const cspHeader = ctx.set.mock.calls[0][1]
    expect(cspHeader).toContain("default-src 'self'")
    expect(cspHeader).toContain("script-src 'self' 'unsafe-eval'")
    expect(cspHeader).toContain("style-src 'self' 'unsafe-inline'")
    expect(cspHeader).toContain("object-src 'none'")
    expect(cspHeader).toContain("base-uri 'self'")
    expect(cspHeader).toContain("connect-src 'self'")
    expect(cspHeader).toContain("font-src 'self'")
    expect(cspHeader).toContain("frame-src 'self'")
    expect(cspHeader).toContain("img-src http: https: data: blob:")
    expect(cspHeader).toContain("manifest-src 'self'")
    expect(cspHeader).toContain("media-src 'self'")
    expect(cspHeader).toContain("worker-src blob:")
  })

  it("should handle errors and log an error message", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation()
    const error = new Error("Test error")
    // @ts-ignore
    crypto.randomBytes.mockImplementation(() => {
      throw error
    })

    await contentSecurityPolicy(ctx, next)

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error occurred in Content-Security-Policy middleware: ${error}`
    )
    expect(next).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
