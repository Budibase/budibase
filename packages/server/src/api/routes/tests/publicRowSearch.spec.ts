import * as setup from "./utilities"
import { FieldType, Table, TableSourceType } from "@budibase/types"

describe("/api/public/v1/tables/:tableId/rows/search", () => {
  let config = setup.getConfig()
  let table: Table

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    table = await config.api.table.save({
      name: "employees",
      type: "table",
      sourceType: TableSourceType.INTERNAL,
      sourceId: "bb_internal",
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
          constraints: {
            type: "string",
          },
        },
        job: {
          name: "job",
          type: FieldType.STRING,
          constraints: {
            type: "string",
          },
        },
      },
    })

    // Create some test data
    await config.api.row.save(table._id!, { name: "John", job: "Engineer" })
    await config.api.row.save(table._id!, { name: "Jane", job: "Manager" })
  })

  afterAll(setup.afterAll)

  describe("equal condition filtering", () => {
    it("should return 400 when searching for non-existent field names", async () => {
      await config.api.public.row.search(
        table._id!,
        {
          query: {
            equal: {
              Banana: "Apples", // Non-existent field with non-existent value
            },
          },
        },
        {
          status: 400,
          body: {
            message: expect.stringContaining("field"),
          },
        }
      )
    })

    it("should return no rows when searching for non-existent values in existing fields", async () => {
      const response = await config.api.public.row.search(table._id!, {
        query: {
          equal: {
            name: "NonExistentName",
          },
        },
      })

      expect(response.data).toHaveLength(0)
      expect(response.data).toEqual([])
    })

    it("should return matching rows when searching for existing values", async () => {
      const response = await config.api.public.row.search(table._id!, {
        query: {
          equal: {
            name: "John",
          },
        },
      })

      expect(response.data).toHaveLength(1)
      expect(response.data[0].name).toBe("John")
      expect(response.data[0].job).toBe("Engineer")
    })

    it("should return all rows when no query is provided", async () => {
      const response = await config.api.public.row.search(table._id!, {})

      expect(response.data).toHaveLength(2)
    })

    it("should return no rows when searching with empty string values", async () => {
      const response = await config.api.public.row.search(table._id!, {
        query: {
          equal: {
            name: "",
          },
        },
      })

      expect(response.data).toHaveLength(0)
      expect(response.data).toEqual([])
    })

    it("should return no rows when searching with null values", async () => {
      const response = await config.api.public.row.search(table._id!, {
        query: {
          equal: {
            name: null,
          },
        },
      })

      expect(response.data).toHaveLength(0)
      expect(response.data).toEqual([])
    })
  })
})
