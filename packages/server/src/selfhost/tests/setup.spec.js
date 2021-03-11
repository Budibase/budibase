const selfhost = require("..")
const env = require("../../environment")

describe("test the setup process", () => {
  beforeAll(() => {
    env.SELF_HOSTED = true
  })

  beforeEach(async () => {
    await selfhost.init()
  })

  afterAll(() => {
    env.SELF_HOSTED = false
  })

  it("getSelfHostInfo", async () => {
    let info = await selfhost.getSelfHostInfo()
    expect(info._id).toEqual("self-host-info")
  })

  it("getSelfHostAPIKey", async () => {
    let apiKey = await selfhost.getSelfHostAPIKey()
    expect(typeof apiKey).toEqual("string")
  })
})