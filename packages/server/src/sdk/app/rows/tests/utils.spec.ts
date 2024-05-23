import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
} from "@budibase/types"
import { generateTableID } from "../../../../db/utils"
import { validate } from "../utils"
import { generator } from "@budibase/backend-core/tests"

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

    it("should accept empty values", async () => {
      const row = {}
      const table = getTable()
      const output = await validate({ table, tableId: table._id!, row })
      expect(output.valid).toBe(true)
      expect(output.errors).toEqual({})
    })

    it("should accept valid times with HH:mm format", async () => {
      const row = {
        time: `${generator.hour()}:${generator.minute()}`,
      }
      const table = getTable()
      const output = await validate({ table, tableId: table._id!, row })
      expect(output.valid).toBe(true)
    })

    it("should accept valid times with HH:mm:ss format", async () => {
      const row = {
        time: `${generator.hour()}:${generator.minute()}:${generator.second()}`,
      }
      const table = getTable()
      const output = await validate({ table, tableId: table._id!, row })
      expect(output.valid).toBe(true)
    })

    describe("required", () => {
      it("should reject empty values", async () => {
        const row = {}
        const table = getTable()
        table.schema.time.constraints = {
          presence: true,
        }
        const output = await validate({ table, tableId: table._id!, row })
        expect(output.valid).toBe(false)
        expect(output.errors).toEqual({ time: ["can't be blank"] })
      })

      it.each([undefined, null])("should reject %s values", async time => {
        const row = { time }
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
