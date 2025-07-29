import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("tables", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const tables = await client.table.fetch()
    return tables.map(table => table._id!).sort()
  })
})
