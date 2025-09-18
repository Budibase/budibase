jest.mock("nodemailer")
import { configs, events } from "@budibase/backend-core"
import {
  Config,
  ConfigType,
  GetPublicSettingsResponse,
  PKCEMethod,
} from "@budibase/types"
import { TestConfiguration, mocks, structures } from "../../../../tests"

mocks.email.mock()

const { google, smtp, settings, oidc } = structures.configs

describe("configs", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.beforeAll()
    jest.clearAllMocks()
    mocks.licenses.usePkceOidc()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  const saveConfig = async (conf: Config, _id?: string, _rev?: string) => {
    const data = { ...conf, _id, _rev }
    const res = await config.api.configs.saveConfig(data)
    return { ...data, ...res }
  }

  describe("POST /api/global/configs", () => {
    describe("google", () => {
      afterEach(async () => {
        await config.deleteConfig(ConfigType.GOOGLE)
      })

      describe("create", () => {
        it("should create activated google config", async () => {
          await saveConfig(google())
          expect(events.auth.SSOCreated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOCreated).toHaveBeenCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSODeactivated).not.toHaveBeenCalled()
          expect(events.auth.SSOActivated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOActivated).toHaveBeenCalledWith(
            ConfigType.GOOGLE
          )
        })

        it("should create deactivated google config", async () => {
          await saveConfig(google({ activated: false }))
          expect(events.auth.SSOCreated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOCreated).toHaveBeenCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSOActivated).not.toHaveBeenCalled()
          expect(events.auth.SSODeactivated).not.toHaveBeenCalled()
        })
      })

      describe("update", () => {
        it("should update google config to deactivated", async () => {
          const googleConf = await saveConfig(google())
          jest.clearAllMocks()
          await saveConfig(
            google({ activated: false }),
            googleConf._id,
            googleConf._rev
          )
          expect(events.auth.SSOUpdated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOUpdated).toHaveBeenCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSOActivated).not.toHaveBeenCalled()
          expect(events.auth.SSODeactivated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSODeactivated).toHaveBeenCalledWith(
            ConfigType.GOOGLE
          )
        })

        it("should update google config to activated", async () => {
          const googleConf = await saveConfig(google({ activated: false }))
          jest.clearAllMocks()
          await saveConfig(
            google({ activated: true }),
            googleConf._id,
            googleConf._rev
          )
          expect(events.auth.SSOUpdated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOUpdated).toHaveBeenCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSODeactivated).not.toHaveBeenCalled()
          expect(events.auth.SSOActivated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOActivated).toHaveBeenCalledWith(
            ConfigType.GOOGLE
          )
        })

        it("should not overwrite secret when updating google config", async () => {
          await saveConfig(google({ clientSecret: "spooky" }))

          const conf = await config.api.configs.getConfig(ConfigType.GOOGLE)
          await saveConfig(conf)

          await config.doInTenant(async () => {
            const rawConf = await configs.getGoogleConfig()
            expect(rawConf!.clientSecret).toEqual("spooky")
          })
        })
      })

      describe("get", () => {
        it("should not leak credentials", async () => {
          await saveConfig(google())
          const conf = await config.api.configs.getConfig(ConfigType.GOOGLE)
          expect(conf.config.clientSecret).toEqual("--secret-value--")
        })
      })
    })

    describe("oidc", () => {
      beforeEach(async () => {
        await config.deleteConfig(ConfigType.OIDC)
      })

      afterEach(async () => {
        await config.deleteConfig(ConfigType.OIDC)
      })

      describe("create", () => {
        it("should create activated OIDC config", async () => {
          await saveConfig(oidc())
          expect(events.auth.SSOCreated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOCreated).toHaveBeenCalledWith(ConfigType.OIDC)
          expect(events.auth.SSODeactivated).not.toHaveBeenCalled()
          expect(events.auth.SSOActivated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOActivated).toHaveBeenCalledWith(ConfigType.OIDC)
        })

        it("should create deactivated OIDC config", async () => {
          await saveConfig(oidc({ activated: false }))
          expect(events.auth.SSOCreated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOCreated).toHaveBeenCalledWith(ConfigType.OIDC)
          expect(events.auth.SSOActivated).not.toHaveBeenCalled()
          expect(events.auth.SSODeactivated).not.toHaveBeenCalled()
        })
      })

      describe("update", () => {
        it("should update OIDC config to deactivated", async () => {
          const oidcConf = await saveConfig(oidc())
          jest.clearAllMocks()
          await saveConfig(
            oidc({ activated: false }),
            oidcConf._id,
            oidcConf._rev
          )
          expect(events.auth.SSOUpdated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOUpdated).toHaveBeenCalledWith(ConfigType.OIDC)
          expect(events.auth.SSOActivated).not.toHaveBeenCalled()
          expect(events.auth.SSODeactivated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSODeactivated).toHaveBeenCalledWith(
            ConfigType.OIDC
          )
        })

        it("should update OIDC config to activated", async () => {
          const oidcConf = await saveConfig(oidc({ activated: false }))
          jest.clearAllMocks()
          await saveConfig(
            oidc({ activated: true }),
            oidcConf._id,
            oidcConf._rev
          )
          expect(events.auth.SSOUpdated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOUpdated).toHaveBeenCalledWith(ConfigType.OIDC)
          expect(events.auth.SSODeactivated).not.toHaveBeenCalled()
          expect(events.auth.SSOActivated).toHaveBeenCalledTimes(1)
          expect(events.auth.SSOActivated).toHaveBeenCalledWith(ConfigType.OIDC)
        })

        it("should not overwrite secret when updating OIDC config", async () => {
          await saveConfig(oidc({ clientSecret: "spooky" }))
          const conf = await config.api.configs.getConfig(ConfigType.OIDC)
          await saveConfig(conf)
          await config.doInTenant(async () => {
            const rawConf = await configs.getOIDCConfig()
            expect(rawConf!.clientSecret).toEqual("spooky")
          })
        })
      })

      describe("get", () => {
        it("should not leak credentials", async () => {
          await saveConfig(oidc({ clientSecret: "spooky" }))
          const conf = await config.api.configs.getConfig(ConfigType.OIDC)
          expect(conf.config.configs[0].clientSecret).toEqual(
            "--secret-value--"
          )
        })

        it("should strip pkce field when null", async () => {
          await saveConfig(oidc({ pkce: null as any }))

          await config.doInTenant(async () => {
            const rawConf = await configs.getOIDCConfig()
            expect(rawConf!).not.toHaveProperty("pkce")
          })
        })

        it("should preserve pkce field when set to valid value", async () => {
          await saveConfig(oidc({ pkce: PKCEMethod.S256 }))

          await config.doInTenant(async () => {
            const rawConf = await configs.getOIDCConfig()
            expect(rawConf!.pkce).toBe(PKCEMethod.S256)
          })
        })
      })
    })

    describe("smtp", () => {
      beforeEach(async () => {
        await config.deleteConfig(ConfigType.SMTP)
      })

      afterEach(async () => {
        await config.deleteConfig(ConfigType.SMTP)
      })

      describe("create", () => {
        it("should create SMTP config", async () => {
          await saveConfig(smtp())
          expect(events.email.SMTPUpdated).not.toHaveBeenCalled()
          expect(events.email.SMTPCreated).toHaveBeenCalledTimes(1)
        })
      })

      describe("update", () => {
        it("should update SMTP config", async () => {
          const smtpConf = await saveConfig(smtp())
          jest.clearAllMocks()
          await saveConfig(smtp({ secure: true }), smtpConf._id, smtpConf._rev)
          expect(events.email.SMTPCreated).not.toHaveBeenCalled()
          expect(events.email.SMTPUpdated).toHaveBeenCalledTimes(1)
        })

        it("should not overwrite secret when updating SMTP config", async () => {
          await saveConfig(smtp({ auth: { user: "jeff", pass: "spooky" } }))
          const conf = await config.api.configs.getConfig(ConfigType.SMTP)
          await saveConfig(conf)
          await config.doInTenant(async () => {
            const rawConf = await configs.getSMTPConfig()
            expect(rawConf!.auth!.pass).toEqual("spooky")
          })
        })
      })

      describe("get", () => {
        it("should not leak credentials", async () => {
          await saveConfig(smtp({ auth: { user: "jeff", pass: "spooky" } }))
          const conf = await config.api.configs.getConfig(ConfigType.SMTP)
          expect(conf.config.auth!.pass).toEqual("--secret-value--")
        })
      })
    })

    describe("settings", () => {
      beforeEach(async () => {
        await config.deleteConfig(ConfigType.SETTINGS)
      })

      afterEach(async () => {
        await config.deleteConfig(ConfigType.SETTINGS)
      })

      describe("create", () => {
        it("should create settings config with default settings", async () => {
          await saveConfig(settings())
          expect(events.org.nameUpdated).not.toHaveBeenCalled()
          expect(events.org.logoUpdated).not.toHaveBeenCalled()
          expect(events.org.platformURLUpdated).not.toHaveBeenCalled()
        })

        it("should create settings config with non-default settings", async () => {
          config.selfHosted()
          await config.deleteConfig(ConfigType.SETTINGS)
          const conf = {
            company: "acme",
            logoUrl: "http://example.com",
            platformUrl: "http://example.com",
          }

          await saveConfig(settings(conf))

          expect(events.org.nameUpdated).toHaveBeenCalledTimes(1)
          expect(events.org.logoUpdated).toHaveBeenCalledTimes(1)
          expect(events.org.platformURLUpdated).toHaveBeenCalledTimes(1)
          config.cloudHosted()
        })
      })

      describe("update", () => {
        it("should update settings config", async () => {
          config.selfHosted()
          await config.deleteConfig(ConfigType.SETTINGS)
          const settingsConfig = await saveConfig(settings())
          settingsConfig.config.company = "acme"
          settingsConfig.config.logoUrl = "http://example.com"
          settingsConfig.config.platformUrl = "http://example.com"

          await saveConfig(
            settingsConfig,
            settingsConfig._id,
            settingsConfig._rev
          )

          expect(events.org.nameUpdated).toHaveBeenCalledTimes(1)
          expect(events.org.logoUpdated).toHaveBeenCalledTimes(1)
          expect(events.org.platformURLUpdated).toHaveBeenCalledTimes(1)
          config.cloudHosted()
        })
      })
    })
  })

  describe("GET /api/global/configs/checklist", () => {
    it("should return the correct checklist", async () => {
      await config.saveSmtpConfig()

      const res = await config.api.configs.getConfigChecklist()
      const checklist = res.body

      expect(checklist.apps.checked).toBeFalsy()
      expect(checklist.smtp.checked).toBeTruthy()
      expect(checklist.smtp.fallback).toBeFalsy()
      expect(checklist.adminUser.checked).toBeTruthy()
    })
  })

  describe("GET /api/global/configs/public", () => {
    beforeEach(async () => {
      await config.deleteConfig(ConfigType.SETTINGS)
    })

    afterEach(async () => {
      await config.deleteConfig(ConfigType.SETTINGS)
    })

    it("should return the expected public settings", async () => {
      await saveConfig(settings())
      mocks.pro.features.isSSOEnforced.mockResolvedValue(false)

      const res = await config.api.configs.getPublicSettings()
      const body = res.body as GetPublicSettingsResponse

      const expected = {
        _id: `config_${ConfigType.SETTINGS}`,
        type: ConfigType.SETTINGS,
        config: {
          company: "Budibase",
          emailBrandingEnabled: true,
          logoUrl: "",
          analyticsEnabled: false,
          google: false,
          googleDatasourceConfigured: false,
          googleCallbackUrl: `http://localhost:10000/api/global/auth/${config.tenantId}/google/callback`,
          isSSOEnforced: false,
          oidc: false,
          oidcCallbackUrl: `http://localhost:10000/api/global/auth/${config.tenantId}/oidc/callback`,
          platformUrl: "http://localhost:10000",
          testimonialsEnabled: true,
        },
      }
      delete body._rev
      expect(body).toEqual(expected)
    })
  })
})
