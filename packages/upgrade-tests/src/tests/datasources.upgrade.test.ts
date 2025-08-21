import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("datasources", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const datasources = await client.datasource.fetch()
    return datasources.map(ds => ds._id!).sort()
  })

  shouldNotChange("names", async () => {
    const datasources = await client.datasource.fetch()
    return datasources
      .map(ds => ds.name || "")
      .filter(name => name)
      .sort()
  })
})
