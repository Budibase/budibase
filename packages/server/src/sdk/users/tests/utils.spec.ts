import { db } from "@budibase/backend-core"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { rawUserMetadata, syncGlobalUsers } from "../utils"

describe("syncGlobalUsers", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(config.end)

  it("the default user is synced", async () => {
    await config.doInContext(config.appId, async () => {
      await syncGlobalUsers()

      const metadata = await rawUserMetadata()
      expect(metadata).toHaveLength(1)
      expect(metadata).toEqual([
        expect.objectContaining({
          _id: db.generateUserMetadataID(config.user._id),
        }),
      ])
    })
  })

  it("app users are synced", async () => {
    await config.doInContext(config.appId, async () => {
      const user1 = await config.createUser()
      const user2 = await config.createUser()

      await syncGlobalUsers()

      const metadata = await rawUserMetadata()
      expect(metadata).toHaveLength(3)
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user1._id),
        })
      )
      expect(metadata).toContainEqual(
        expect.objectContaining({
          _id: db.generateUserMetadataID(user2._id),
        })
      )
    })
  })
})
