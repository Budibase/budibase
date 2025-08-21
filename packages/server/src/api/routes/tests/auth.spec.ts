import * as setup from "./utilities"
import {
  generateUserMetadataID,
  getGlobalIDFromUserMetadataID,
} from "../../../db/utils"

describe("/authenticate", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  describe("fetch self", () => {
    it("should be able to fetch self", async () => {
      const res = await request
        .get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body._id).toEqual(generateUserMetadataID(config.getUser()._id))
    })

    it("should container the global user ID", async () => {
      const res = await request
        .get(`/api/self`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.globalId).toEqual(
        getGlobalIDFromUserMetadataID(config.getUser()._id)
      )
    })
  })
})
