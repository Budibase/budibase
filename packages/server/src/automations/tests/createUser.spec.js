const usageQuota = require("../../utilities/usageQuota")
const env = require("../../environment")
const setup = require("./utilities")
const { BUILTIN_ROLE_IDS } = require("../../utilities/security/roles")
const { ViewNames } = require("../../db/utils")

jest.mock("../../utilities/usageQuota")

describe("test the create user action", () => {
  let config = setup.getConfig()
  let user

  beforeEach(async () => {
    await config.init()
    user = {
      email: "test@test.com",
      password: "password",
      roleId: BUILTIN_ROLE_IDS.POWER
    }
  })

  afterAll(setup.afterAll)

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.CREATE_USER.stepId, user)
    expect(res.id).toBeDefined()
    expect(res.revision).toBeDefined()
    const userDoc = await config.getRow(ViewNames.USERS, res.id)
    expect(userDoc.email).toEqual(user.email)
  })

  it("should return an error if no inputs provided", async () => {
    const res = await setup.runStep(setup.actions.CREATE_USER.stepId, {})
    expect(res.success).toEqual(false)
  })

  it("check usage quota attempts", async () => {
    env.CLOUD = true
    await setup.runStep(setup.actions.CREATE_USER.stepId, user)
    expect(usageQuota.update).toHaveBeenCalledWith(setup.apiKey, "users", 1)
    env.CLOUD = false
  })
})
