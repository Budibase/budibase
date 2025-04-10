import crypto from "crypto"
import contentSecurityPolicy from "../contentSecurityPolicy"
import { app } from "../../cache"
import { Feature, App } from "@budibase/types"
import { users, licenses } from "../../../tests/core/utilities/structures"

jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
  randomUUID: jest.fn(),
}))
jest.mock("../../cache", () => ({
  app: {
    getAppMetadata: jest.fn(),
  },
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
    // Ctx setup to let us try and use CSP whitelist
    const fakeAppId = "app_sdfdsfsdfsdf"
    ctx.appId = fakeAppId
    ctx.user = {
      license: {
        features: [Feature.CUSTOM_APP_SCRIPTS],
      },
    }

    const consoleSpy = jest.spyOn(console, "error").mockImplementation()
    const error = new Error("Test error")
    // @ts-ignore
    app.getAppMetadata.mockImplementation(() => {
      throw error
    })
    await contentSecurityPolicy(ctx, next)

    expect(app.getAppMetadata).toHaveBeenCalledWith(fakeAppId)
    expect(consoleSpy).toHaveBeenCalledWith(
      `Error occurred in Content-Security-Policy middleware: ${error}`
    )
    expect(next).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("should add custom CSP whitelist", async () => {
    const appId = "app_foo"
    const domain = "https://*.foo.bar"

    // Ctx setup to let us try and use CSP whitelist
    ctx.appId = appId
    ctx.user = users.user()
    ctx.user.license = licenses.license({
      features: [Feature.CUSTOM_APP_SCRIPTS],
    })

    // @ts-ignore
    app.getAppMetadata.mockImplementation(function (): App {
      return {
        appId,
        type: "foo",
        version: "1",
        componentLibraries: [],
        name: "foo",
        url: "/foo",
        template: undefined,
        instance: { _id: appId },
        tenantId: ctx.user.tenantId,
        status: "foo",
        scripts: [
          {
            id: "foo",
            name: "Test",
            location: "Head",
            cspWhitelist: domain,
          },
        ],
      }
    })

    await contentSecurityPolicy(ctx, next)

    const cspHeader = ctx.set.mock.calls[0][1]
    expect(cspHeader).toContain(`default-src 'self' ${domain};`)
    expect(app.getAppMetadata).toHaveBeenCalledWith(appId)
    expect(next).toHaveBeenCalled()
  })

  it("should filter out invalid domains", async () => {
    const appId = "app_foo"
    const validDomain = "https://*.foo.bar"
    const invalidDomain = "https:*&*(£$:\n;"

    // Ctx setup to let us try and use CSP whitelist
    ctx.appId = appId
    ctx.user = users.user()
    ctx.user.license = licenses.license({
      features: [Feature.CUSTOM_APP_SCRIPTS],
    })

    // @ts-ignore
    app.getAppMetadata.mockImplementation(function (): App {
      return {
        appId,
        type: "foo",
        version: "1",
        componentLibraries: [],
        name: "foo",
        url: "/foo",
        template: undefined,
        instance: { _id: appId },
        tenantId: ctx.user.tenantId,
        status: "foo",
        scripts: [
          {
            id: "foo",
            name: "Test",
            location: "Head",
            cspWhitelist: validDomain + "\n" + invalidDomain,
          },
        ],
      }
    })

    await contentSecurityPolicy(ctx, next)

    const cspHeader = ctx.set.mock.calls[0][1]
    expect(cspHeader).toContain(`default-src 'self' ${validDomain};`)
    expect(cspHeader).not.toContain(invalidDomain)
    expect(app.getAppMetadata).toHaveBeenCalledWith(appId)
    expect(next).toHaveBeenCalled()
  })
})
