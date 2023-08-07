// mock the email system
jest.mock("nodemailer")
import { TestConfiguration, structures, mocks } from "../../../../tests"
mocks.email.mock()
import { events } from "@budibase/backend-core"
import { GetPublicSettingsResponse, Config, ConfigType } from "@budibase/types"

describe("configs", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.beforeAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  const saveConfig = async (conf: Config, _id?: string, _rev?: string) => {
    const data = {
      ...conf,
      _id,
      _rev,
    }
    const res = await config.api.configs.saveConfig(data)
    return {
      ...data,
      ...res.body,
    }
  }

  const saveSettingsConfig = async (
    conf?: any,
    _id?: string,
    _rev?: string
  ) => {
    const settingsConfig = structures.configs.settings(conf)
    return saveConfig(settingsConfig, _id, _rev)
  }

  describe("POST /api/global/configs", () => {
    describe("google", () => {
      const saveGoogleConfig = async (
        conf?: any,
        _id?: string,
        _rev?: string
      ) => {
        const googleConfig = structures.configs.google(conf)
        return saveConfig(googleConfig, _id, _rev)
      }

      describe("create", () => {
        it("should create activated google config", async () => {
          await saveGoogleConfig()
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(ConfigType.GOOGLE)
          await config.deleteConfig(ConfigType.GOOGLE)
        })

        it("should create deactivated google config", async () => {
          await saveGoogleConfig({ activated: false })
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).not.toBeCalled()
          await config.deleteConfig(ConfigType.GOOGLE)
        })
      })

      describe("update", () => {
        it("should update google config to deactivated", async () => {
          const googleConf = await saveGoogleConfig()
          jest.clearAllMocks()
          await saveGoogleConfig(
            { ...googleConf.config, activated: false },
            googleConf._id,
            googleConf._rev
          )
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).toBeCalledTimes(1)
          expect(events.auth.SSODeactivated).toBeCalledWith(ConfigType.GOOGLE)
          await config.deleteConfig(ConfigType.GOOGLE)
        })

        it("should update google config to activated", async () => {
          const googleConf = await saveGoogleConfig({ activated: false })
          jest.clearAllMocks()
          await saveGoogleConfig(
            { ...googleConf.config, activated: true },
            googleConf._id,
            googleConf._rev
          )
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(ConfigType.GOOGLE)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(ConfigType.GOOGLE)
          await config.deleteConfig(ConfigType.GOOGLE)
        })
      })
    })

    describe("oidc", () => {
      const saveOIDCConfig = async (
        conf?: any,
        _id?: string,
        _rev?: string
      ) => {
        const oidcConfig = structures.configs.oidc(conf)
        return saveConfig(oidcConfig, _id, _rev)
      }

      describe("create", () => {
        it("should create activated OIDC config", async () => {
          await saveOIDCConfig()
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(ConfigType.OIDC)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(ConfigType.OIDC)
          await config.deleteConfig(ConfigType.OIDC)
        })

        it("should create deactivated OIDC config", async () => {
          await saveOIDCConfig({ activated: false })
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(ConfigType.OIDC)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).not.toBeCalled()
          await config.deleteConfig(ConfigType.OIDC)
        })
      })

      describe("update", () => {
        it("should update OIDC config to deactivated", async () => {
          const oidcConf = await saveOIDCConfig()
          jest.clearAllMocks()
          await saveOIDCConfig(
            { ...oidcConf.config.configs[0], activated: false },
            oidcConf._id,
            oidcConf._rev
          )
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(ConfigType.OIDC)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).toBeCalledTimes(1)
          expect(events.auth.SSODeactivated).toBeCalledWith(ConfigType.OIDC)
          await config.deleteConfig(ConfigType.OIDC)
        })

        it("should update OIDC config to activated", async () => {
          const oidcConf = await saveOIDCConfig({ activated: false })
          jest.clearAllMocks()
          await saveOIDCConfig(
            { ...oidcConf.config.configs[0], activated: true },
            oidcConf._id,
            oidcConf._rev
          )
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(ConfigType.OIDC)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(ConfigType.OIDC)
          await config.deleteConfig(ConfigType.OIDC)
        })
      })
    })

    describe("smtp", () => {
      const saveSMTPConfig = async (
        conf?: any,
        _id?: string,
        _rev?: string
      ) => {
        const smtpConfig = structures.configs.smtp(conf)
        return saveConfig(smtpConfig, _id, _rev)
      }

      describe("create", () => {
        it("should create SMTP config", async () => {
          await config.deleteConfig(ConfigType.SMTP)
          await saveSMTPConfig()
          expect(events.email.SMTPUpdated).not.toBeCalled()
          expect(events.email.SMTPCreated).toBeCalledTimes(1)
          await config.deleteConfig(ConfigType.SMTP)
        })
      })

      describe("update", () => {
        it("should update SMTP config", async () => {
          const smtpConf = await saveSMTPConfig()
          jest.clearAllMocks()
          await saveSMTPConfig(smtpConf.config, smtpConf._id, smtpConf._rev)
          expect(events.email.SMTPCreated).not.toBeCalled()
          expect(events.email.SMTPUpdated).toBeCalledTimes(1)
          await config.deleteConfig(ConfigType.SMTP)
        })
      })
    })

    describe("settings", () => {
      describe("create", () => {
        it("should create settings config with default settings", async () => {
          await config.deleteConfig(ConfigType.SETTINGS)

          await saveSettingsConfig()

          expect(events.org.nameUpdated).not.toBeCalled()
          expect(events.org.logoUpdated).not.toBeCalled()
          expect(events.org.platformURLUpdated).not.toBeCalled()
        })

        it("should create settings config with non-default settings", async () => {
          config.selfHosted()
          await config.deleteConfig(ConfigType.SETTINGS)
          const conf = {
            company: "acme",
            logoUrl: "http://example.com",
            platformUrl: "http://example.com",
          }

          await saveSettingsConfig(conf)

          expect(events.org.nameUpdated).toBeCalledTimes(1)
          expect(events.org.logoUpdated).toBeCalledTimes(1)
          expect(events.org.platformURLUpdated).toBeCalledTimes(1)
          config.cloudHosted()
        })
      })

      describe("update", () => {
        it("should update settings config", async () => {
          config.selfHosted()
          await config.deleteConfig(ConfigType.SETTINGS)
          const settingsConfig = await saveSettingsConfig()
          settingsConfig.config.company = "acme"
          settingsConfig.config.logoUrl = "http://example.com"
          settingsConfig.config.platformUrl = "http://example.com"

          await saveSettingsConfig(
            settingsConfig.config,
            settingsConfig._id,
            settingsConfig._rev
          )

          expect(events.org.nameUpdated).toBeCalledTimes(1)
          expect(events.org.logoUpdated).toBeCalledTimes(1)
          expect(events.org.platformURLUpdated).toBeCalledTimes(1)
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
      expect(checklist.adminUser.checked).toBeTruthy()
    })
  })

  describe("GET /api/global/configs/public", () => {
    it("should return the expected public settings", async () => {
      await saveSettingsConfig()
      mocks.pro.features.isSSOEnforced.mockResolvedValue(false)

      const res = await config.api.configs.getPublicSettings()
      const body = res.body as GetPublicSettingsResponse

      const expected = {
        _id: "config_settings",
        type: "settings",
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
