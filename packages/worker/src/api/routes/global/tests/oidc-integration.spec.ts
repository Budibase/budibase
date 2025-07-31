import { TestConfiguration } from "../../../../tests"
import { getOIDCConfigs, waitForDex } from "../../../../tests/utils/oidc"
import { ConfigType, OIDCInnerConfig, PKCEMethod } from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import fetch from "node-fetch"

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

  describe("OIDC Configuration Management", () => {
    afterEach(async () => {
      await config.deleteConfig(ConfigType.OIDC)
    })

    it("should create OIDC config without PKCE", async () => {
      const saveResult = await config.api.configs.saveConfig({
        type: ConfigType.OIDC,
        config: {
          configs: [oidcConfigs.noPkce],
        },
      })

      expect(saveResult).toBeDefined()
      expect(saveResult.type).toBe(ConfigType.OIDC)
      expect(saveResult._id).toBeDefined()

      // Retrieve and validate the saved config
      const retrievedConfig = await config.api.configs.getConfig(
        ConfigType.OIDC
      )
      expect(retrievedConfig.config.configs[0]).toMatchObject({
        clientID: "budibase-no-pkce",
        name: "Test OIDC (No PKCE)",
        activated: true,
      })
      expect(retrievedConfig.config.configs[0].pkce).toBeUndefined()
    })

    it("should create OIDC config with PKCE", async () => {
      const saveResult = await config.api.configs.saveConfig({
        type: ConfigType.OIDC,
        config: {
          configs: [oidcConfigs.withPkce],
        },
      })

      expect(saveResult).toBeDefined()
      expect(saveResult.type).toBe(ConfigType.OIDC)
      expect(saveResult._id).toBeDefined()

      // Retrieve and validate the saved config
      const retrievedConfig = await config.api.configs.getConfig(
        ConfigType.OIDC
      )
      expect(retrievedConfig.config.configs[0]).toMatchObject({
        clientID: "budibase-pkce",
        name: "Test OIDC (PKCE)",
        activated: true,
        pkce: PKCEMethod.S256,
      })
    })

    it("should retrieve and validate OIDC configurations", async () => {
      // First save both configs
      await config.api.configs.saveConfig({
        type: ConfigType.OIDC,
        config: {
          configs: [oidcConfigs.noPkce, oidcConfigs.withPkce],
        },
      })

      // Then retrieve them
      const result = await config.api.configs.getConfig(ConfigType.OIDC)
      expect(result).toBeDefined()
      expect(result.config.configs).toHaveLength(2)

      const noPkceConfig = result.config.configs.find(
        (c: OIDCInnerConfig) => c.clientID === "budibase-no-pkce"
      )
      const pkceConfig = result.config.configs.find(
        (c: OIDCInnerConfig) => c.clientID === "budibase-pkce"
      )

      expect(noPkceConfig).toBeDefined()
      expect(noPkceConfig?.pkce).toBeUndefined()

      expect(pkceConfig).toBeDefined()
      expect(pkceConfig?.pkce).toBe(PKCEMethod.S256)
    })
  })

  describe("OIDC Strategy Configuration", () => {
    it("should create strategy config without PKCE", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )

      expect(strategyConfig).toMatchObject({
        issuer: `http://localhost:5556`,
        clientID: "budibase-no-pkce",
        clientSecret: "test-secret-no-pkce",
        callbackURL: callbackUrl,
      })
      expect(strategyConfig.pkce).toBeUndefined()
    })

    it("should create strategy config with PKCE", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.withPkce,
        callbackUrl
      )

      expect(strategyConfig).toMatchObject({
        issuer: `http://localhost:5556`,
        clientID: "budibase-pkce",
        clientSecret: "test-secret-pkce",
        callbackURL: callbackUrl,
        pkce: PKCEMethod.S256,
      })
    })

    it("should validate OIDC well-known endpoints", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"
      const strategyConfig = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )

      expect(strategyConfig.authorizationURL).toBe(`http://localhost:5556/auth`)
      expect(strategyConfig.tokenURL).toBe(`http://localhost:5556/token`)
      expect(strategyConfig.userInfoURL).toBe(`http://localhost:5556/userinfo`)
    })
  })

  describe("PKCE Method Validation", () => {
    afterEach(async () => {
      await config.deleteConfig(ConfigType.OIDC)
    })

    it("should accept S256 PKCE method", async () => {
      const configWithS256: OIDCInnerConfig = {
        ...oidcConfigs.noPkce,
        pkce: PKCEMethod.S256,
      }

      await config.api.configs.saveConfig({
        type: ConfigType.OIDC,
        config: {
          configs: [configWithS256],
        },
      })
      const result = await config.api.configs.getConfig(ConfigType.OIDC)

      expect(result).toBeDefined()
      expect(result.config.configs[0].pkce).toBe(PKCEMethod.S256)
    })

    it("should accept PLAIN PKCE method", async () => {
      const configWithPlain: OIDCInnerConfig = {
        ...oidcConfigs.noPkce,
        pkce: PKCEMethod.PLAIN,
      }

      await config.api.configs.saveConfig({
        type: ConfigType.OIDC,
        config: {
          configs: [configWithPlain],
        },
      })
      const result = await config.api.configs.getConfig(ConfigType.OIDC)

      expect(result).toBeDefined()
      expect(result.config.configs[0].pkce).toBe(PKCEMethod.PLAIN)
    })

    it("should preserve PKCE setting in strategy config", async () => {
      const callbackUrl = "http://localhost:4001/api/global/auth/oidc/callback"

      // Test S256
      const strategyConfigS256 = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.withPkce,
        callbackUrl
      )
      expect(strategyConfigS256.pkce).toBe(PKCEMethod.S256)

      // Test without PKCE
      const strategyConfigNone = await middleware.oidc.fetchStrategyConfig(
        oidcConfigs.noPkce,
        callbackUrl
      )
      expect(strategyConfigNone.pkce).toBeUndefined()
    })
  })
})
