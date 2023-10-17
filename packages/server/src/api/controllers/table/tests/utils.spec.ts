import { FieldType } from "@budibase/types"
import { AutoFieldSubTypes } from "../../../../constants"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { importToRows } from "../utils"

describe("utils", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)

  describe("importToRows", () => {
    it("consecutive row have consecutive auto ids", async () => {
      await config.doInContext(config.appId, async () => {
        const table = await config.createTable({
          name: "table",
          type: "table",
          schema: {
            autoId: {
              name: "autoId",
              type: FieldType.NUMBER,
              subtype: AutoFieldSubTypes.AUTO_ID,
              autocolumn: true,
              constraints: {
                type: FieldType.NUMBER,
                presence: true,
              },
            },
            name: {
              name: "name",
              type: FieldType.STRING,
              constraints: {
                type: FieldType.STRING,
                presence: true,
              },
            },
          },
        })

        const data = [{ name: "Alice" }, { name: "Bob" }, { name: "Claire" }]

        const result = await importToRows(data, table, config.user)
        expect(result).toEqual([
          expect.objectContaining({
            autoId: 1,
            name: "Alice",
          }),
          expect.objectContaining({
            autoId: 2,
            name: "Bob",
          }),
          expect.objectContaining({
            autoId: 3,
            name: "Claire",
          }),
        ])
      })
    })

    it("can import data without a specific user performing the action", async () => {
      await config.doInContext(config.appId, async () => {
        const table = await config.createTable({
          name: "table",
          type: "table",
          schema: {
            autoId: {
              name: "autoId",
              type: FieldType.NUMBER,
              subtype: AutoFieldSubTypes.AUTO_ID,
              autocolumn: true,
              constraints: {
                type: FieldType.NUMBER,
                presence: true,
              },
            },
            name: {
              name: "name",
              type: FieldType.STRING,
              constraints: {
                type: FieldType.STRING,
                presence: true,
              },
            },
          },
        })

        const data = [{ name: "Alice" }, { name: "Bob" }, { name: "Claire" }]

        const result = await importToRows(data, table)
        expect(result).toHaveLength(3)
      })
    })
  })
})
