const setup = require("./utilities")
const { generateUserMetadataID } = require("../../../db/utils")

describe("/authenticate", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
  })

  describe("fetch self", () => {
    it("should be able to fetch self", async () => {
      const res = await request
        .get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(generateUserMetadataID("us_uuid1"))
    })
  })
})