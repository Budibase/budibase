import { TestConfiguration } from "../../../../tests"
import {
  getOIDCConfigs,
  waitForDex,
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
} from "../../../../tests/utils/oidc"
import { ConfigType, OIDCInnerConfig, PKCEMethod } from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import fetch from "node-fetch"
import { generator, mocks } from "@budibase/backend-core/tests"

mocks.licenses.usePkceOidc()

// Set longer timeout for container startup
jest.setTimeout(120000)

describe("OIDC Integration Tests", () => {
  const config = new TestConfiguration()
  let oidcConfigs: {
    noPkce: OIDCInnerConfig
    withPkce: OIDCInnerConfig
  }
  let dexPort: number

  beforeAll(async () => {
    await config.beforeAll()
    dexPort = await waitForDex()
    oidcConfigs = getOIDCConfigs(dexPort)
  }, 120000)

  afterAll(async () => {
    await config.afterAll()
  })

  describe("OIDC Authentication Flow Tests", () => {
    afterEach(async () => {
      await config.deleteConfig(ConfigType.OIDC)
    })

    it("should generate authorization URL without PKCE", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )

      const state = generator.guid()
      const nonce = generator.guid()

      const authUrl = buildAuthorizationUrl({
        authorizationUrl: strategyConfig.authorizationURL,
        clientId: strategyConfig.clientID,
        redirectUri: callbackUrl,
        state,
        nonce,
      })

      expect(authUrl).toContain(strategyConfig.authorizationURL)
      expect(authUrl).toContain(`client_id=${strategyConfig.clientID}`)
      expect(authUrl).toContain(
        `redirect_uri=${encodeURIComponent(callbackUrl)}`
      )
      expect(authUrl).toContain(`state=${state}`)
      expect(authUrl).toContain(`nonce=${nonce}`)
      expect(authUrl).toContain("response_type=code")
      expect(authUrl).toContain("scope=openid+profile+email")
      expect(authUrl).not.toContain("code_challenge")
    })

    it("should generate authorization URL with PKCE", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.withPkce,
        callbackUrl
      )

      const state = generator.guid()
      const nonce = generator.guid()
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = generateCodeChallenge(codeVerifier, PKCEMethod.S256)

      const authUrl = buildAuthorizationUrl({
        authorizationUrl: strategyConfig.authorizationURL,
        clientId: strategyConfig.clientID,
        redirectUri: callbackUrl,
        state,
        nonce,
        pkce: {
          codeChallenge,
          codeChallengeMethod: PKCEMethod.S256,
        },
      })

      expect(authUrl).toContain(strategyConfig.authorizationURL)
      expect(authUrl).toContain(`client_id=${strategyConfig.clientID}`)
      expect(authUrl).toContain(
        `redirect_uri=${encodeURIComponent(callbackUrl)}`
      )
      expect(authUrl).toContain(`state=${state}`)
      expect(authUrl).toContain(`nonce=${nonce}`)
      expect(authUrl).toContain("response_type=code")
      expect(authUrl).toContain("scope=openid+profile+email")
      expect(authUrl).toContain(
        `code_challenge=${encodeURIComponent(codeChallenge)}`
      )
      expect(authUrl).toContain("code_challenge_method=S256")
    })

    it("should validate well-known OIDC configuration from Dex", async () => {
      const wellKnownUrl = `http://localhost:${dexPort}/.well-known/openid-configuration`
      const response = await fetch(wellKnownUrl)

      expect(response.ok).toBe(true)

      const config = await response.json()
      expect(config.issuer).toBe(`http://localhost:${dexPort}`)
      expect(config.authorization_endpoint).toBe(
        `http://localhost:${dexPort}/auth`
      )
      expect(config.token_endpoint).toBe(`http://localhost:${dexPort}/token`)
      expect(config.userinfo_endpoint).toBe(
        `http://localhost:${dexPort}/userinfo`
      )
      expect(config.jwks_uri).toBe(`http://localhost:${dexPort}/keys`)
      expect(config.scopes_supported).toContain("openid")
      expect(config.response_types_supported).toContain("code")
      expect(config.code_challenge_methods_supported).toContain("S256")
      expect(config.code_challenge_methods_supported).toContain("plain")
    })
  })

  describe("PKCE Authentication Tests", () => {
    afterEach(async () => {
      await config.deleteConfig(ConfigType.OIDC)
    })

    it("should generate valid PKCE code verifier", () => {
      const verifier = generateCodeVerifier()

      expect(verifier).toBeDefined()
      expect(typeof verifier).toBe("string")
      expect(verifier.length).toBeGreaterThan(40)
      expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/)

      // Should generate different verifiers each time
      const verifier2 = generateCodeVerifier()
      expect(verifier).not.toBe(verifier2)
    })

    it("should generate valid PKCE code challenge for S256 method", () => {
      const verifier = generateCodeVerifier()
      const challenge = generateCodeChallenge(verifier, PKCEMethod.S256)

      expect(challenge).toBeDefined()
      expect(typeof challenge).toBe("string")
      expect(challenge).not.toBe(verifier)
      expect(challenge.length).toBe(43) // Base64url encoded SHA256 hash length
      expect(challenge).toMatch(/^[A-Za-z0-9\-_]+$/)
    })

    it("should generate valid PKCE code challenge for PLAIN method", () => {
      const verifier = generateCodeVerifier()
      const challenge = generateCodeChallenge(verifier, PKCEMethod.PLAIN)

      expect(challenge).toBeDefined()
      expect(challenge).toBe(verifier) // PLAIN method returns verifier as-is
    })

    it("should reject invalid PKCE method", () => {
      const verifier = generateCodeVerifier()

      expect(() => {
        generateCodeChallenge(verifier, "INVALID" as PKCEMethod)
      }).toThrow("Unsupported PKCE method: INVALID")
    })

    it("should handle token exchange without PKCE", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )

      // Mock token exchange (since we can't easily get a real auth code in tests)
      const mockCode = "mock-authorization-code"

      try {
        await exchangeCodeForTokens(
          strategyConfig.tokenURL,
          strategyConfig.clientID,
          strategyConfig.clientSecret,
          mockCode,
          callbackUrl
        )
      } catch (error: any) {
        // Expect this to fail with mock code, but validate the request structure
        expect(error.message).toContain("Token exchange failed")
        expect(error.message).toContain("400") // Bad Request for invalid code
      }
    })

    it("should handle token exchange with PKCE", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.withPkce,
        callbackUrl
      )

      const codeVerifier = generateCodeVerifier()
      const mockCode = "mock-authorization-code"

      try {
        await exchangeCodeForTokens(
          strategyConfig.tokenURL,
          strategyConfig.clientID,
          strategyConfig.clientSecret,
          mockCode,
          callbackUrl,
          codeVerifier
        )
      } catch (error: any) {
        // Expect this to fail with mock code, but validate the request structure
        expect(error.message).toContain("Token exchange failed")
        expect(error.message).toContain("400") // Bad Request for invalid code
      }
    })
  })

  describe("Token Validation Tests", () => {
    afterEach(async () => {
      await config.deleteConfig(ConfigType.OIDC)
    })

    it("should validate OIDC strategy configuration for token endpoints", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"

      // Test without PKCE
      const strategyConfigNoPkce = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )

      expect(strategyConfigNoPkce.tokenURL).toBeDefined()
      expect(strategyConfigNoPkce.userInfoURL).toBeDefined()
      expect(strategyConfigNoPkce.clientID).toBe("budibase-no-pkce")
      expect(strategyConfigNoPkce.clientSecret).toBe("test-secret-no-pkce")
      expect(strategyConfigNoPkce.pkce).toBeUndefined()

      // Test with PKCE
      const strategyConfigWithPkce = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.withPkce,
        callbackUrl
      )

      expect(strategyConfigWithPkce.tokenURL).toBeDefined()
      expect(strategyConfigWithPkce.userInfoURL).toBeDefined()
      expect(strategyConfigWithPkce.clientID).toBe("budibase-pkce")
      expect(strategyConfigWithPkce.clientSecret).toBe("test-secret-pkce")
      expect(strategyConfigWithPkce.pkce).toBe(PKCEMethod.S256)
    })

    it("should validate OIDC endpoints are accessible", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )

      // Test authorization endpoint
      const authResponse = await fetch(strategyConfig.authorizationURL, {
        method: "HEAD",
      })
      expect(authResponse.status).toBeLessThan(500) // Should not be server error

      // Test token endpoint
      const tokenResponse = await fetch(strategyConfig.tokenURL, {
        method: "HEAD",
      })
      expect(tokenResponse.status).toBeLessThan(500) // Should not be server error

      // Test userinfo endpoint
      const userInfoResponse = await fetch(strategyConfig.userInfoURL, {
        method: "HEAD",
      })
      expect(userInfoResponse.status).toBeLessThan(500) // Should not be server error
    })
  })
})
