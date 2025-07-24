import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("rows", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("row IDs", async () => {
    const tables = await client.table.fetch()
    const rowIds: { [tableId: string]: string[] } = {}
    for (const table of tables) {
      const rows = await client.row.fetch(table._id!)
      rowIds[table._id!] = rows.map(row => row._id!)
    }
    return rowIds
  })
})
