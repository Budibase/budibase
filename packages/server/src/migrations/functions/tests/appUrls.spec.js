const { DocumentTypes } = require("@budibase/backend-core/db")
const env = require("../../../environment")
const TestConfig = require("../../../tests/utilities/TestConfiguration")

const migration = require("../appUrls")

describe("run", () => {
  let config = new TestConfig(false)
  const CouchDB = config.getCouch()

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)  

  it("runs successfully", async () => {
    const app = await config.createApp("testApp")
    const appDb = new CouchDB(app.appId)
    let metadata = await appDb.get(DocumentTypes.APP_METADATA)
    delete metadata.url
    await appDb.put(metadata)
    
    await migration.run(appDb)

    metadata = await appDb.get(DocumentTypes.APP_METADATA)
    expect(metadata.url).toEqual("/testapp")
  })
})
