import { AIOperationEnum, AutoFieldSubType, FieldType } from "@budibase/types"
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
              subtype: AutoFieldSubType.AUTO_ID,
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

        const result = await importToRows(data, table, config.user?._id)
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
              subtype: AutoFieldSubType.AUTO_ID,
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

    it("Imports write as expected with AI columns", async () => {
      await config.doInContext(config.appId, async () => {
        const table = await config.createTable({
          name: "table",
          type: "table",
          schema: {
            autoId: {
              name: "autoId",
              type: FieldType.NUMBER,
              subtype: AutoFieldSubType.AUTO_ID,
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
            aicol: {
              name: "aicol",
              type: FieldType.AI,
              operation: AIOperationEnum.PROMPT,
              prompt: "Test prompt",
            },
          },
        })

        const data = [
          { name: "Alice", aicol: "test" },
          { name: "Bob", aicol: "test" },
          { name: "Claire", aicol: "test" },
        ]

        const result = await importToRows(data, table, config.user?._id)
        expect(result).toEqual([
          expect.objectContaining({
            autoId: 1,
            name: "Alice",
            aicol: "test",
          }),
          expect.objectContaining({
            autoId: 2,
            name: "Bob",
            aicol: "test",
          }),
          expect.objectContaining({
            autoId: 3,
            name: "Claire",
            aicol: "test",
          }),
        ])
      })
    })
  })
})
