const setup = require("../../tests/utilities")
const { generateMakeRequest } = require("./utils")

const workerRequests = require("../../../../utilities/workerRequests")

let config = setup.getConfig()
let apiKey, globalUser, makeRequest

beforeAll(async () => {
  await config.init()
  globalUser = await config.globalUser()
  apiKey = await config.generateApiKey(globalUser._id)
  makeRequest = generateMakeRequest(apiKey, setup)
  workerRequests.readGlobalUser.mockReturnValue(globalUser)
})

afterAll(setup.afterAll)

describe("check user endpoints", () => {
  it("should not allow a user to update their own roles", async () => {
    const res = await makeRequest("put", `/users/${globalUser._id}`, {
      ...globalUser,
      roles: {
        "app_1": "ADMIN",
      }
    })
    expect(workerRequests.saveGlobalUser.mock.lastCall[0].body.data.roles["app_1"]).toBeUndefined()
    expect(res.status).toBe(200)
    expect(res.body.data.roles["app_1"]).toBeUndefined()
  })

  it("should not allow a user to delete themselves", async () => {
    const res = await makeRequest("delete", `/users/${globalUser._id}`)
    expect(res.status).toBe(405)
    expect(workerRequests.deleteGlobalUser.mock.lastCall).toBeUndefined()
  })
})

