const {  DocumentType, doWithDB } = require("@budibase/backend-core/db")
const TestConfig = require("../../../tests/utilities/TestConfiguration")

const migration = require("../appUrls")

describe("run", () => {
  let config = new TestConfig(false)

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)  

  it("runs successfully", async () => {
    const app = await config.createApp("testApp")
    const metadata = await doWithDB(app.appId, async db => {
      const metadataDoc = await db.get( DocumentType.APP_METADATA)
      delete metadataDoc.url
      await db.put(metadataDoc)
      await migration.run(db)
      return await db.get( DocumentType.APP_METADATA)
    })
    expect(metadata.url).toEqual("/testapp")
  })
})
