import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("views", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("names", async () => {
    const tables = await client.table.fetch()
    return tables
      .map(table => table.views || {})
      .flatMap(view => Object.values(view))
      .map(view => view.name || "unknown")
      .sort()
  })
})
