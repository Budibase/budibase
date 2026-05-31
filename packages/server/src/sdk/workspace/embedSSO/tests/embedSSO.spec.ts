import * as backendCore from "@budibase/backend-core"
import { EmbedSSOConfig, PASSWORD_REPLACEMENT } from "@budibase/types"
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

const hmacConfig = (
  overrides: Partial<EmbedSSOConfig> = {}
): EmbedSSOConfig => ({
  enabled: true,
  algorithm: "HS256",
  key: SECRET,
  emailClaim: "userdata.email",
  ...overrides,
})

const buildCtx = () => ({
  secure: true,
  cookies: { set: jest.fn() },
})

describe("embedSSO sdk", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("authenticateEmbedUser", () => {
    it("maps a valid token to an existing user and sets the auth cookie", async () => {
      getGlobalUserByEmail.mockResolvedValue({
        _id: "us_123",
        email: "user@example.com",
      } as any)

      const token = jwt.sign(
        { userdata: { email: "User@Example.com" } },
        SECRET,
        { algorithm: "HS256" }
      )
      const ctx = buildCtx()

      const result = await authenticateEmbedUser(
        ctx as any,
        hmacConfig(),
        token
      )

      expect(result).toBe(true)
      expect(getGlobalUserByEmail).toHaveBeenCalledWith("user@example.com")
      expect(createASession).toHaveBeenCalled()
      const [name, , options] = ctx.cookies.set.mock.calls[0]
      expect(name).toBe(backendCore.constants.Cookie.Auth)
      expect(options.sameSite).toBe("none")
      expect(options.secure).toBe(true)
    })

    it("rejects a token signed with the wrong secret", async () => {
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        "nope"
      )
      const ctx = buildCtx()

      const result = await authenticateEmbedUser(
        ctx as any,
        hmacConfig(),
        token
      )

      expect(result).toBe(false)
      expect(getGlobalUserByEmail).not.toHaveBeenCalled()
      expect(ctx.cookies.set).not.toHaveBeenCalled()
    })

    it("does not create a session when no Budibase user matches", async () => {
      getGlobalUserByEmail.mockResolvedValue(undefined)
      const token = jwt.sign(
        { userdata: { email: "missing@example.com" } },
        SECRET
      )
      const ctx = buildCtx()

      const result = await authenticateEmbedUser(
        ctx as any,
        hmacConfig(),
        token
      )

      expect(result).toBe(false)
      expect(createASession).not.toHaveBeenCalled()
      expect(ctx.cookies.set).not.toHaveBeenCalled()
    })

    it("validates the issuer when configured", async () => {
      const token = jwt.sign(
        { userdata: { email: "user@example.com" } },
        SECRET,
        {
          issuer: "https://other.example.com",
        }
      )
      const ctx = buildCtx()

      const result = await authenticateEmbedUser(
        ctx as any,
        hmacConfig({ issuer: "https://nextcloud.example.com" }),
        token
      )

      expect(result).toBe(false)
    })
  })

  describe("encodeConfigForStorage", () => {
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
