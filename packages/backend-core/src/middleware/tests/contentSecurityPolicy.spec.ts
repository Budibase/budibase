import { Feature, Workspace } from "@budibase/types"
import crypto from "crypto"
import { licenses, users } from "../../../tests/core/utilities/structures"
import { workspace } from "../../cache"
import { contentSecurityPolicy } from "../contentSecurityPolicy"

jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
  randomUUID: jest.fn(),
}))
jest.mock("../../cache", () => ({
  workspace: {
    getWorkspaceMetadata: jest.fn(),
  },
}))
jest.mock("../../environment", () => ({
  __esModule: true,
  default: {
    isDev: () => false,
    isProd: () => true,
    isTest: () => true,
    isJest: () => true,
    isWorker: () => false,
    isApps: () => false,
    isQA: () => false,
    LOG_LEVEL: "info",
    CUSTOM_CSP_MEDIA_SRC: undefined,
    CUSTOM_CSP_SCRIPT_SRC: undefined,
    CUSTOM_CSP_CONNECT_SRC: undefined,
    CUSTOM_CSP_IMG_SRC: undefined,
    CUSTOM_CSP_FONT_SRC: undefined,
    CUSTOM_CSP_FRAME_SRC: undefined,
  },
}))

import env from "../../environment"

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
        `script-src 'self' 'unsafe-eval' https://*.budibase.net https://cdn.budi.live https://js.intercomcdn.com https://widget.intercom.io https://d2l5prqdbvm3op.cloudfront.net https://us-assets.i.posthog.com https://www.google.com/recaptcha/api.js https://companion.frontapp.com 'nonce-mocked/nonce'`
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
    workspace.getWorkspaceMetadata.mockImplementation(() => {
      throw error
    })
    await contentSecurityPolicy(ctx, next)

    expect(workspace.getWorkspaceMetadata).toHaveBeenCalledWith(fakeAppId)
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
    workspace.getWorkspaceMetadata.mockImplementation(function (): Workspace {
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
    expect(cspHeader).toContain(`script-src 'self' 'unsafe-eval'`)
    expect(cspHeader).toContain(`${domain}`)
    expect(cspHeader).toContain(
      `media-src 'self' https://js.intercomcdn.com https://cdn.budi.live ${domain};`
    )
    expect(workspace.getWorkspaceMetadata).toHaveBeenCalledWith(appId)
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
    workspace.getWorkspaceMetadata.mockImplementation(function (): Workspace {
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
    expect(workspace.getWorkspaceMetadata).toHaveBeenCalledWith(appId)
    expect(next).toHaveBeenCalled()
  })

  describe("embed allowed origins", () => {
    const appId = "app_embed"
    const buildWorkspace = (embedAllowedOrigins?: string[]): Workspace => ({
      appId,
      type: "foo",
      version: "1",
      componentLibraries: [],
      name: "foo",
      url: "/foo",
      template: undefined,
      instance: { _id: appId },
      tenantId: "default",
      status: "foo",
      embedAllowedOrigins,
    })

    const embedRequest = (origins?: string[]) => {
      ctx.appId = appId
      ctx.request = { get: () => "true" }
      // @ts-ignore
      workspace.getWorkspaceMetadata.mockImplementation(() =>
        buildWorkspace(origins)
      )
    }

    it("should restrict frame-ancestors to the configured origins", async () => {
      embedRequest(["https://example.com", "https://*.foo.bar"])

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).toContain(
        "frame-ancestors https://example.com https://*.foo.bar"
      )
      expect(next).toHaveBeenCalled()
    })

    it("should allow any origin when the allowlist is empty", async () => {
      embedRequest([])

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).toContain("frame-ancestors *")
    })

    it("should filter out invalid origins", async () => {
      embedRequest(["https://example.com", "https://evil.com', script-src *"])

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).toContain("frame-ancestors https://example.com")
      expect(cspHeader).not.toContain("script-src *")
    })

    it("should keep the wildcard default when the metadata lookup fails", async () => {
      ctx.appId = appId
      ctx.request = { get: () => "true" }
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()
      // @ts-ignore
      workspace.getWorkspaceMetadata.mockImplementation(() => {
        throw new Error("boom")
      })

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).toContain("frame-ancestors *")
      consoleSpy.mockRestore()
    })

    it("should not set frame-ancestors for non-embed requests", async () => {
      ctx.appId = appId
      ctx.request = { get: () => undefined }

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).not.toContain("frame-ancestors")
    })
  })

  describe("custom environment variables", () => {
    it("should add custom domains from environment variables", async () => {
      // @ts-ignore
      env.CUSTOM_CSP_MEDIA_SRC = "https://media.example.com"
      // @ts-ignore
      env.CUSTOM_CSP_CONNECT_SRC = "https://api.example.com"

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).toContain(
        "media-src 'self' https://js.intercomcdn.com https://cdn.budi.live https://media.example.com"
      )
      expect(cspHeader).toContain("connect-src 'self'")
      expect(cspHeader).toContain("https://api.example.com")
    })

    it("should filter out invalid domains in environment variables", async () => {
      // @ts-ignore
      env.CUSTOM_CSP_MEDIA_SRC = "https://media.example.com, invalid-domain!!"

      await contentSecurityPolicy(ctx, next)

      const cspHeader = ctx.set.mock.calls[0][1]
      expect(cspHeader).toContain(
        "media-src 'self' https://js.intercomcdn.com https://cdn.budi.live https://media.example.com"
      )
      expect(cspHeader).not.toContain("invalid-domain!!")
    })
  })
})
