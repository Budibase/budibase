import { generator, structures } from "../../../../../tests"
import {
  OIDCInnerConfig,
  SSOAuthDetails,
  SSOProviderType,
} from "@budibase/types"
import * as _sso from "../sso"
import * as oidc from "../oidc"
import { setEnv } from "../../../../environment"
import nock from "nock"
import jwt from "jsonwebtoken"
import type OpenIDConnectStrategy from "@govtechsg/passport-openidconnect"

jest.mock("@govtechsg/passport-openidconnect")
const mockStrategy = require("@govtechsg/passport-openidconnect").Strategy

jest.mock("../sso")
const sso = jest.mocked(_sso)

const mockSaveUser = jest.fn()
const mockDone = jest.fn()

describe("oidc", () => {
  const callbackUrl = generator.url()
  const oidcConfig: OIDCInnerConfig = structures.sso.oidcConfig()
  const wellKnownConfig = structures.sso.oidcWellKnownConfig()

  beforeEach(() => {
    nock.cleanAll()
    nock(oidcConfig.configUrl).get("/").reply(200, wellKnownConfig)
  })

  describe("strategyFactory", () => {
    it("should create successfully create an oidc strategy", async () => {
      const strategyConfiguration = await oidc.fetchStrategyConfig(
        oidcConfig,
        callbackUrl
      )
      await oidc.strategyFactory(strategyConfiguration, mockSaveUser)

      const expectedOptions = {
        issuer: wellKnownConfig.issuer,
        authorizationURL: wellKnownConfig.authorization_endpoint,
        tokenURL: wellKnownConfig.token_endpoint,
        userInfoURL: wellKnownConfig.userinfo_endpoint,
        clientID: oidcConfig.clientID,
        clientSecret: oidcConfig.clientSecret,
        callbackURL: callbackUrl,
      }
      expect(mockStrategy).toHaveBeenCalledWith(
        expectedOptions,
        expect.anything()
      )
    })
  })

  describe("fetchStrategyConfig - allowUnverifiedEmailLinking", () => {
    let restoreEnv: () => void

    afterEach(() => {
      restoreEnv?.()
    })

    it("uses the database value when the env override is unset", async () => {
      restoreEnv = setEnv({ OIDC_ALLOW_UNVERIFIED_EMAIL_LINKING: undefined })

      const config = await oidc.fetchStrategyConfig(
        { ...oidcConfig, allowUnverifiedEmailLinking: true },
        callbackUrl
      )

      expect(config.allowUnverifiedEmailLinking).toBe(true)
    })

    it("env override forces the value on regardless of the database", async () => {
      restoreEnv = setEnv({ OIDC_ALLOW_UNVERIFIED_EMAIL_LINKING: "true" })

      const config = await oidc.fetchStrategyConfig(
        { ...oidcConfig, allowUnverifiedEmailLinking: false },
        callbackUrl
      )

      expect(config.allowUnverifiedEmailLinking).toBe(true)
    })

    it("env override forces the value off regardless of the database", async () => {
      restoreEnv = setEnv({ OIDC_ALLOW_UNVERIFIED_EMAIL_LINKING: "false" })

      const config = await oidc.fetchStrategyConfig(
        { ...oidcConfig, allowUnverifiedEmailLinking: true },
        callbackUrl
      )

      expect(config.allowUnverifiedEmailLinking).toBe(false)
    })
  })

  describe("authenticate", () => {
    const details: SSOAuthDetails = structures.sso.authDetails()
    details.providerType = SSOProviderType.OIDC
    const profile = details.profile!
    const issuer = profile.provider

    let idToken: string
    const params: Record<string, unknown> = {}
    const context: OpenIDConnectStrategy.AuthContext = {}

    let authenticateFn: any
    let uiProfile: OpenIDConnectStrategy.MergedProfile & {
      _json?: {
        email?: string
        email_verified?: boolean
        picture?: string
      }
      provider?: string
    }
    let idProfile: OpenIDConnectStrategy.Profile & {
      _json?: {
        email?: string
        email_verified?: boolean
      }
    }

    beforeEach(() => {
      jest.clearAllMocks()
      authenticateFn = oidc.buildVerifyFn(mockSaveUser)
      uiProfile = {
        id: profile.id,
        name: profile.name,
        _json: { ...profile._json },
        provider: profile.provider,
      }
      idProfile = {
        id: profile.id,
        name: profile.name,
        emails: [{ value: details.email! }],
        username: details.email,
        _json: { email: details.email, email_verified: true },
      }
      idToken = jwt.sign(
        {
          sub: profile.id,
          email: details.email,
          email_verified: true,
          preferred_username: details.email,
        },
        "test-secret"
      )
    })

    async function authenticate() {
      await authenticateFn(
        issuer,
        uiProfile,
        idProfile,
        context,
        idToken,
        details.oauth2.accessToken,
        details.oauth2.refreshToken,
        params,
        mockDone
      )
    }

    it("passes auth details to sso module", async () => {
      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("uses id token email to get email", async () => {
      delete uiProfile._json?.email

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("marks email as unverified when the userinfo email_verified claim is false", async () => {
      uiProfile._json!.email_verified = false

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerified: false }),
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("marks email as unverified when no email_verified claim is present", async () => {
      delete uiProfile._json?.email_verified
      idToken = jwt.sign(
        { sub: profile.id, email: details.email },
        "test-secret"
      )

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerified: false }),
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("uses id token email_verified when userinfo has no email", async () => {
      delete uiProfile._json?.email
      idToken = jwt.sign(
        {
          sub: profile.id,
          email: details.email,
          email_verified: false,
        },
        "test-secret"
      )

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerified: false }),
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("passes the allowUnverifiedEmailLinking flag through to sso", async () => {
      authenticateFn = oidc.buildVerifyFn(mockSaveUser, true)

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        details,
        false,
        mockDone,
        mockSaveUser,
        true
      )
    })

    it("uses id token username to get email", async () => {
      delete uiProfile._json?.email
      delete idProfile.emails
      idToken = jwt.sign(
        { sub: profile.id, preferred_username: details.email },
        "test-secret"
      )

      await authenticate()

      const expectedDetails = {
        ...details,
        // a preferred_username used as the email is never considered verified
        emailVerified: false,
        profile: {
          ...details.profile,
          _json: {
            ...details.profile?._json,
            email: undefined,
          },
        },
      }

      expect(sso.authenticate).toHaveBeenCalledWith(
        expectedDetails,
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("uses invalid id token username to get email", async () => {
      delete uiProfile._json?.email
      delete idProfile.emails

      idProfile.username = "invalidUsername"
      idToken = jwt.sign(
        { sub: profile.id, preferred_username: "invalidUsername" },
        "test-secret"
      )

      await expect(authenticate()).rejects.toThrow(
        "Could not determine user email from profile"
      )
    })

    it("normalizes uppercase emails before authenticating", async () => {
      const upperEmail = "MIKE.SEALEY@EXAMPLE.COM"
      uiProfile._json = { email: upperEmail }
      idProfile.emails = [{ value: upperEmail }]
      idProfile.username = upperEmail
      idToken = jwt.sign(
        {
          sub: profile.id,
          email: upperEmail,
          email_verified: true,
        },
        "test-secret"
      )

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        expect.objectContaining({ email: upperEmail.toLowerCase() }),
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("uses a matching verified id token email when userinfo omits email_verified", async () => {
      delete uiProfile._json?.email_verified

      await authenticate()

      expect(sso.authenticate).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerified: true }),
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("rejects userinfo for a different subject", async () => {
      uiProfile.id = generator.string()

      await expect(authenticate()).rejects.toThrow(
        "UserInfo subject does not match ID token subject"
      )
      expect(sso.authenticate).not.toHaveBeenCalled()
    })

    it("populates first and last name from profile data", async () => {
      const givenName = "Ada"
      const familyName = "Lovelace"
      uiProfile.name = {
        givenName,
        familyName,
      }
      idProfile.name = {
        givenName,
        familyName,
      }

      await authenticate()

      const expectedDetails = {
        ...details,
        profile: {
          ...details.profile,
          name: {
            givenName,
            familyName,
          },
        },
      }

      expect(sso.authenticate).toHaveBeenCalledWith(
        expectedDetails,
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })

    it("falls back to display name when given and family names are missing", async () => {
      const displayName = "Ada Lovelace"
      delete uiProfile.name
      delete idProfile.name
      uiProfile.displayName = displayName

      await authenticate()

      const expectedDetails = {
        ...details,
        profile: {
          ...details.profile,
          name: {
            givenName: displayName,
            familyName: "",
          },
        },
      }

      expect(sso.authenticate).toHaveBeenCalledWith(
        expectedDetails,
        false,
        mockDone,
        mockSaveUser,
        false
      )
    })
  })
})
