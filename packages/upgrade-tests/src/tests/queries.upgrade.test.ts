import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("queries", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const queries = await client.query.fetch()
    return queries.map(query => query._id!).sort()
  })

  shouldNotChange("names", async () => {
    const queries = await client.query.fetch()
    return queries.map(query => query.name).sort()
  })
})
