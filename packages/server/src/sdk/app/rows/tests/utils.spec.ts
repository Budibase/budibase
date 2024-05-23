import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
} from "@budibase/types"
import { generateTableID } from "../../../../db/utils"
import { validate } from "../utils"

describe("validate", () => {
  describe("time only", () => {
    const getTable = (): Table => ({
      type: "table",
      _id: generateTableID(),
      name: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        time: {
          name: "time",
          type: FieldType.DATETIME,
          timeOnly: true,
        },
      },
    })

    it("should accept empty fields", async () => {
      const row = {}
      const table = getTable()
      const output = await validate({ table, tableId: table._id!, row })
      expect(output.valid).toBe(true)
      expect(output.errors).toEqual({})
    })

    describe("required", () => {
      it("should reject empty fields", async () => {
        const row = {}
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
        }
        const output = await validate({ table, tableId: table._id!, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toEqual({ time: ["can't be blank"] })
      })
    })
  })
})
