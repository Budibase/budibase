// mock the email system
jest.mock("nodemailer")
const setup = require("./utilities")
setup.emailMock()
const { Configs } = require("@budibase/backend-core/constants")
const { events } = require("@budibase/backend-core")

describe("configs", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await setup.afterAll()
  })

  describe("post /api/global/configs", () => {

    const saveConfig = async (conf, type, _id, _rev) => {
      const data = {
        type,
        config: conf,
        _id,
        _rev
      }

      const res = await request
        .post(`/api/global/configs`)
        .send(data)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      return {
        ...data,
        ...res.body
      }
    }

    describe("google", () => {
      const saveGoogleConfig = async (conf, _id, _rev) => {
        const googleConfig = {
          clientID: "clientID",
          clientSecret: "clientSecret",
          activated: true,
          ...conf
        }

        return saveConfig(googleConfig, Configs.GOOGLE, _id, _rev)
      }
  
      describe("create", () => {
        it ("should create activated google config", async () => {
          await saveGoogleConfig()
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(Configs.GOOGLE)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(Configs.GOOGLE)
          await config.deleteConfig(Configs.GOOGLE)
        })

        it ("should create deactivated google config", async () => {
          await saveGoogleConfig({ activated: false })
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(Configs.GOOGLE)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).not.toBeCalled()
          await config.deleteConfig(Configs.GOOGLE)
        })
      })

      describe("update", () => {
        it ("should update google config to deactivated", async () => {
          const googleConf = await saveGoogleConfig()
          jest.clearAllMocks()
          await saveGoogleConfig({ ...googleConf.config, activated: false }, googleConf._id, googleConf._rev)
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(Configs.GOOGLE)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).toBeCalledTimes(1)
          expect(events.auth.SSODeactivated).toBeCalledWith(Configs.GOOGLE)
          await config.deleteConfig(Configs.GOOGLE)
        })

        it ("should update google config to activated", async () => {
          const googleConf = await saveGoogleConfig({ activated: false })
          jest.clearAllMocks()
          await saveGoogleConfig({ ...googleConf.config, activated: true}, googleConf._id, googleConf._rev)
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(Configs.GOOGLE)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(Configs.GOOGLE)
          await config.deleteConfig(Configs.GOOGLE)
        })
      })     
    })

    describe("oidc", () => {
      const saveOIDCConfig = async (conf, _id, _rev) => {
        const oidcConfig = {
          configs: [{
            clientID: "clientID",
            clientSecret: "clientSecret",
            configUrl: "http://example.com",
            logo: "logo",
            name: "oidc",
            uuid: "uuid",
            activated: true,
            ...conf
          }]
        }
        return saveConfig(oidcConfig, Configs.OIDC, _id, _rev)
      }

      describe("create", () => {
        it ("should create activated OIDC config", async () => {
          await saveOIDCConfig()
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(Configs.OIDC)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(Configs.OIDC)
          await config.deleteConfig(Configs.OIDC)
        })

        it ("should create deactivated OIDC config", async () => {
          await saveOIDCConfig({ activated: false })
          expect(events.auth.SSOCreated).toBeCalledTimes(1)
          expect(events.auth.SSOCreated).toBeCalledWith(Configs.OIDC)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).not.toBeCalled()
          await config.deleteConfig(Configs.OIDC)
        })
      })

      describe("update", () => {
        it ("should update OIDC config to deactivated", async () => {
          const oidcConf = await saveOIDCConfig()
          jest.clearAllMocks()
          await saveOIDCConfig({ ...oidcConf.config.configs[0], activated: false }, oidcConf._id, oidcConf._rev)
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(Configs.OIDC)
          expect(events.auth.SSOActivated).not.toBeCalled()
          expect(events.auth.SSODeactivated).toBeCalledTimes(1)
          expect(events.auth.SSODeactivated).toBeCalledWith(Configs.OIDC)
          await config.deleteConfig(Configs.OIDC)
        })

        it ("should update google config to activated", async () => {
          const oidcConf = await saveOIDCConfig({ activated: false })
          jest.clearAllMocks()
          await saveOIDCConfig({ ...oidcConf.config.configs[0], activated: true}, oidcConf._id, oidcConf._rev)
          expect(events.auth.SSOUpdated).toBeCalledTimes(1)
          expect(events.auth.SSOUpdated).toBeCalledWith(Configs.OIDC)
          expect(events.auth.SSODeactivated).not.toBeCalled()
          expect(events.auth.SSOActivated).toBeCalledTimes(1)
          expect(events.auth.SSOActivated).toBeCalledWith(Configs.OIDC)
          await config.deleteConfig(Configs.OIDC)
        })
      })

    })
  })

  it("should return the correct checklist status based on the state of the budibase installation", async () => {
    await config.saveSmtpConfig()

    const res = await request
      .get(`/api/global/configs/checklist`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    const checklist = res.body

    expect(checklist.apps.checked).toBeFalsy()
    expect(checklist.smtp.checked).toBeTruthy()
    expect(checklist.adminUser.checked).toBeTruthy()
  })
})
