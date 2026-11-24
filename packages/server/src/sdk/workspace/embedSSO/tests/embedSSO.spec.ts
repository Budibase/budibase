import * as backendCore from "@budibase/backend-core"
import { type Ctx, EmbedSSOConfig, PASSWORD_REPLACEMENT } from "@budibase/types"
import { generateKeyPairSync } from "crypto"
import { IncomingMessage, ServerResponse } from "http"
import Koa from "koa"
import { Socket } from "net"
import jwt from "jsonwebtoken"

jest.mock("@budibase/backend-core", (): typeof backendCore => {
  const actual: typeof backendCore = jest.requireActual(
    "@budibase/backend-core"
  )
  return {
    ...actual,
    sessions: {
      ...actual.sessions,
      createASession: jest.fn(),
    },
    users: {
      ...actual.users,
      getGlobalUserByEmail: jest.fn(),
    },
    tenancy: {
      ...actual.tenancy,
      getTenantId: jest.fn(() => "default"),
    },
  }
})

import {
  authenticateEmbedUser,
  encodeConfigForStorage,
  maskConfigForBuilder,
} from "../index"

const getGlobalUserByEmail = backendCore.users
  .getGlobalUserByEmail as jest.MockedFunction<
  typeof backendCore.users.getGlobalUserByEmail
>
const createASession = backendCore.sessions
  .createASession as jest.MockedFunction<
  typeof backendCore.sessions.createASession
>

const SECRET = "super-secret-value"
const AUDIENCE = "budibase-example"

const hmacConfig = (
  overrides: Partial<EmbedSSOConfig> = {}
): EmbedSSOConfig => ({
  enabled: true,
  algorithm: "HS256",
  key: SECRET,
  audience: AUDIENCE,
  emailClaim: "userdata.email",
  ...overrides,
})

const buildCtx = (secure = true) => {
  const app = new Koa()
  app.proxy = true
  const request = new IncomingMessage(new Socket())
  request.headers["x-forwarded-proto"] = secure ? "https" : "http"
  const response = new ServerResponse(request)
  const ctx = app.createContext(request, response) as Ctx
  const cookiesSet = jest
    .spyOn(ctx.cookies, "set")
    .mockImplementation(() => ctx.cookies)
  return { ctx, cookiesSet }
}

describe("embedSSO sdk", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("authenticateEmbedUser", () => {
    it("accepts a token with the configured audience and sets the auth cookie", async () => {
      getGlobalUserByEmail.mockResolvedValue({
        _id: "us_123",
        email: "user@example.com",
      } as any)

      const token = jwt.sign(
        { userdata: { email: "User@Example.com" } },
        SECRET,
        { algorithm: "HS256", audience: AUDIENCE }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(ctx, hmacConfig(), token)

      expect(result).toBe(true)
      expect(getGlobalUserByEmail).toHaveBeenCalledWith("user@example.com")
      expect(createASession).toHaveBeenCalled()
      const [name, authToken, options] = cookiesSet.mock.calls[0]
      expect(name).toBe(backendCore.constants.Cookie.Auth)
      expect(jwt.decode(authToken || "")).toMatchObject({
        exp: expect.any(Number),
      })
      expect(options?.sameSite).toBe("none")
      expect(options?.secure).toBe(true)
    })

    it("falls back to a Lax cookie over an insecure connection", async () => {
      getGlobalUserByEmail.mockResolvedValue({
        _id: "us_123",
        email: "user@example.com",
      } as any)

      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET,
        { audience: AUDIENCE }
      )
      const { ctx, cookiesSet } = buildCtx(false)

      const result = await authenticateEmbedUser(ctx, hmacConfig(), token)

      expect(result).toBe(true)
      const [, , options] = cookiesSet.mock.calls[0]
      expect(options?.sameSite).toBe("lax")
      expect(options?.secure).toBe(false)
    })

    it("rejects a token signed with the wrong secret", async () => {
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        "nope",
        { audience: AUDIENCE }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(ctx, hmacConfig(), token)

      expect(result).toBe(false)
      expect(getGlobalUserByEmail).not.toHaveBeenCalled()
      expect(cookiesSet).not.toHaveBeenCalled()
    })

    it("does not create a session when no Budibase user matches", async () => {
      getGlobalUserByEmail.mockResolvedValue(undefined)
      const token = jwt.sign(
        { userdata: { email: "missing@example.com" } },
        SECRET,
        { audience: AUDIENCE }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(ctx, hmacConfig(), token)

      expect(result).toBe(false)
      expect(createASession).not.toHaveBeenCalled()
      expect(cookiesSet).not.toHaveBeenCalled()
    })

    it("validates the issuer when configured", async () => {
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET,
        {
          issuer: "https://other.example.com",
          audience: AUDIENCE,
        }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(
        ctx,
        hmacConfig({ issuer: "https://nextcloud.example.com" }),
        token
      )

      expect(result).toBe(false)
      expect(cookiesSet).not.toHaveBeenCalled()
    })

    it("rejects a token whose aud claim differs from the configured audience", async () => {
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET,
        { audience: "other-client" }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(ctx, hmacConfig(), token)

      expect(result).toBe(false)
      expect(getGlobalUserByEmail).not.toHaveBeenCalled()
      expect(createASession).not.toHaveBeenCalled()
      expect(cookiesSet).not.toHaveBeenCalled()
    })

    it("rejects a token without aud when an audience is configured", async () => {
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(ctx, hmacConfig(), token)

      expect(result).toBe(false)
      expect(createASession).not.toHaveBeenCalled()
      expect(cookiesSet).not.toHaveBeenCalled()
    })

    it("accepts a token without an audience when none is configured", async () => {
      getGlobalUserByEmail.mockResolvedValue({
        _id: "us_123",
        email: "user@example.com",
        tenantId: "default",
        roles: {},
      })
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(
        ctx,
        hmacConfig({ audience: undefined }),
        token
      )

      expect(result).toBe(true)
      expect(createASession).toHaveBeenCalled()
      expect(cookiesSet).toHaveBeenCalled()
    })

    it("skips audience matching when none is configured", async () => {
      getGlobalUserByEmail.mockResolvedValue({
        _id: "us_123",
        email: "user@example.com",
        tenantId: "default",
        roles: {},
      })
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET,
        { audience: "other-client" }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(
        ctx,
        hmacConfig({ audience: undefined }),
        token
      )

      expect(result).toBe(true)
      expect(createASession).toHaveBeenCalled()
      expect(cookiesSet).toHaveBeenCalled()
    })

    it("rejects an RS256 token issued for another relying party", async () => {
      const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
      })
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        privateKey,
        { algorithm: "RS256", audience: "other-client" }
      )
      const { ctx, cookiesSet } = buildCtx()

      const result = await authenticateEmbedUser(
        ctx,
        hmacConfig({
          algorithm: "RS256",
          key: publicKey.export({ format: "pem", type: "spki" }).toString(),
        }),
        token
      )

      expect(result).toBe(false)
      expect(getGlobalUserByEmail).not.toHaveBeenCalled()
      expect(createASession).not.toHaveBeenCalled()
      expect(cookiesSet).not.toHaveBeenCalled()
    })
  })

  describe("encodeConfigForStorage", () => {
    it("allows an enabled configuration without an audience", () => {
      const result = encodeConfigForStorage(hmacConfig({ audience: undefined }))

      expect(result.enabled).toBe(true)
      expect(result.audience).toBeUndefined()
    })

    it("encrypts a newly provided key", () => {
      const result = encodeConfigForStorage(hmacConfig({ key: "plain-secret" }))
      expect(result.key).not.toBe("plain-secret")
      expect(result.key).toContain("bbembed_enc::")
    })

    it("preserves the existing key when the masked placeholder is submitted", () => {
      const existing = encodeConfigForStorage(hmacConfig({ key: "original" }))
      const result = encodeConfigForStorage(
        hmacConfig({ key: PASSWORD_REPLACEMENT }),
        existing
      )
      expect(result.key).toBe(existing.key)
    })

    it("rejects reusing the stored key when the algorithm changed", () => {
      const existing = encodeConfigForStorage(hmacConfig({ key: "original" }))
      expect(() =>
        encodeConfigForStorage(
          hmacConfig({ algorithm: "ES256", key: PASSWORD_REPLACEMENT }),
          existing
        )
      ).toThrow(
        "A new verification key is required when changing the embed SSO algorithm"
      )
    })

    it("allows changing the algorithm together with a new key", () => {
      const existing = encodeConfigForStorage(hmacConfig({ key: "original" }))
      const result = encodeConfigForStorage(
        hmacConfig({ algorithm: "ES256", key: "-----BEGIN PUBLIC KEY-----" }),
        existing
      )
      expect(result.algorithm).toBe("ES256")
      expect(result.key).toContain("bbembed_enc::")
    })
  })

  describe("maskConfigForBuilder", () => {
    it("masks a set key", () => {
      expect(maskConfigForBuilder(hmacConfig()).key).toBe(PASSWORD_REPLACEMENT)
    })

    it("leaves an empty key empty", () => {
      expect(maskConfigForBuilder(hmacConfig({ key: "" })).key).toBe("")
    })
  })
})
