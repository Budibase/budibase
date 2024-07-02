import {
  generateUserMetadataID,
  getGlobalIDFromUserMetadataID,
} from "../../../db/utils"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/authenticate", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  describe("fetch self", () => {
    it("should be able to fetch self", async () => {
      const res = await config
        .request!.get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(generateUserMetadataID(config.getUser()._id))
    })

    it("should container the global user ID", async () => {
      const res = await config
        .request!.get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.globalId).toEqual(
        getGlobalIDFromUserMetadataID(config.getUser()._id)
      )
    })
  })
})
