import TestConfig from "../../tests/utilities/TestConfiguration"
import { basicTable } from "../../tests/utilities/structures"
import { Table } from "@budibase/types"
import sdk from "../"

describe("tables", () => {
  const config = new TestConfig()
  let table: Table

  beforeAll(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
  })

  describe("getTables", () => {
    it("should be able to retrieve tables", async () => {
      await config.doInContext(config.appId, async () => {
        const tables = await sdk.tables.getTables([table._id!])
        expect(tables.length).toBe(1)
        expect(tables[0]._id).toBe(table._id)
        expect(tables[0].name).toBe(table.name)
      })
    })

    it("shouldn't fail when retrieving tables that don't exist", async () => {
      await config.doInContext(config.appId, async () => {
        const tables = await sdk.tables.getTables(["unknown"])
        expect(tables.length).toBe(0)
      })
    })

    it("should de-duplicate the IDs", async () => {
      await config.doInContext(config.appId, async () => {
        const tables = await sdk.tables.getTables([table._id!, table._id!])
        expect(tables.length).toBe(1)
      })
    })
  })
})
