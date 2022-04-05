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

  afterAll(setup.afterAll)

  describe("post /api/global/configs", () => {

    const saveConfig = async (type, _id, _rev) => {
      const data = {
        type,
        _id,
        _rev
      }
      const res = await request
        .post(`/api/global/configs`)
        .send(data)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      return res.body
    }

    describe("google", () => {
      const saveGoogleConfig = async (_id, _rev) => {
        return saveConfig(Configs.GOOGLE, _id, _rev)
      }
  
      it ("should create google config", async () => {
        await saveGoogleConfig()
        expect(events.auth.SSOCreated).toBeCalledTimes(1)
        expect(events.auth.SSOCreated).toBeCalledWith(Configs.GOOGLE)
        await config.deleteConfig(Configs.GOOGLE)
      })
  
      it ("should update google config", async () => {
        const googleConf = await saveGoogleConfig()
        await saveGoogleConfig(googleConf._id, googleConf._rev)
        expect(events.auth.SSOUpdated).toBeCalledTimes(1)
        expect(events.auth.SSOUpdated).toBeCalledWith(Configs.GOOGLE)
        await config.deleteConfig(Configs.GOOGLE)
      })
    })

    describe("oidc", () => {
      const saveOIDCConfig = async (_id, _rev) => {
        return saveConfig(Configs.OIDC, _id, _rev)
      }

      it ("should create OIDC config", async () => {
        await saveOIDCConfig()
        expect(events.auth.SSOCreated).toBeCalledTimes(1)
        expect(events.auth.SSOCreated).toBeCalledWith(Configs.OIDC)
        await config.deleteConfig(Configs.OIDC)
      })
  
      it ("should update OIDC config", async () => {
        const oidcConf = await saveOIDCConfig()
        await saveOIDCConfig(oidcConf._id, oidcConf._rev)
        expect(events.auth.SSOUpdated).toBeCalledTimes(1)
        expect(events.auth.SSOUpdated).toBeCalledWith(Configs.OIDC)
        await config.deleteConfig(Configs.OIDC)
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
