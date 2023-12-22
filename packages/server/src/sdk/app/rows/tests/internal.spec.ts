import tk from "timekeeper"
import * as internalSdk from "../internal"

import { generator } from "@budibase/backend-core/tests"
import {
  INTERNAL_TABLE_SOURCE_ID,
  TableSourceType,
  FieldType,
  Table,
  AutoFieldSubTypes,
} from "@budibase/types"

import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { cache } from "@budibase/backend-core"

tk.freeze(Date.now())

describe("sdk >> rows >> internal", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  function makeRow() {
    return {
      name: generator.first(),
      surname: generator.last(),
      age: generator.age(),
      address: generator.address(),
    }
  }

  describe("save", () => {
    const tableData: Table = {
      name: generator.word(),
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
          constraints: {
            type: FieldType.STRING,
          },
        },
        surname: {
          name: "surname",
          type: FieldType.STRING,
          constraints: {
            type: FieldType.STRING,
          },
        },
        age: {
          name: "age",
          type: FieldType.NUMBER,
          constraints: {
            type: FieldType.NUMBER,
          },
        },
        address: {
          name: "address",
          type: FieldType.STRING,
          constraints: {
            type: FieldType.STRING,
          },
        },
      },
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("save will persist the row properly", async () => {
      const table = await config.createTable(tableData)
      const row = makeRow()

      await config.doInContext(config.appId, async () => {
        const response = await internalSdk.save(
          table._id!,
          row,
          config.user._id
        )

        expect(response).toEqual({
          table,
          row: {
            ...row,
            type: "row",
            _rev: expect.stringMatching("1-.*"),
          },
          squashed: {
            ...row,
            type: "row",
            _rev: expect.stringMatching("1-.*"),
          },
        })

        const persistedRow = await config.getRow(table._id!, response.row._id!)
        expect(persistedRow).toEqual({
          ...row,
          type: "row",
          _rev: expect.stringMatching("1-.*"),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })
    })

    it("auto ids will update when creating new rows", async () => {
      const table = await config.createTable({
        ...tableData,
        schema: {
          ...tableData.schema,
          id: {
            name: "id",
            type: FieldType.AUTO,
            subtype: AutoFieldSubTypes.AUTO_ID,
            autocolumn: true,
            lastID: 0,
          },
        },
      })
      const row = makeRow()

      await config.doInContext(config.appId, async () => {
        const response = await internalSdk.save(
          table._id!,
          row,
          config.user._id
        )

        expect(response).toEqual({
          table: {
            ...table,
            schema: {
              ...table.schema,
              id: {
                ...table.schema.id,
                lastID: 1,
              },
            },
          },
          row: {
            ...row,
            id: 1,
            type: "row",
            _rev: expect.stringMatching("1-.*"),
          },
          squashed: {
            ...row,
            id: 1,
            type: "row",
            _rev: expect.stringMatching("1-.*"),
          },
        })

        const persistedRow = await config.getRow(table._id!, response.row._id!)
        expect(persistedRow).toEqual({
          ...row,
          type: "row",
          id: 1,
          _rev: expect.stringMatching("1-.*"),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })
    })

    it("auto ids will update when creating new rows in parallel", async () => {
      function makeRows(count: number) {
        return Array.from({ length: count }, () => makeRow())
      }

      const table = await config.createTable({
        ...tableData,
        schema: {
          ...tableData.schema,
          id: {
            name: "id",
            type: FieldType.AUTO,
            subtype: AutoFieldSubTypes.AUTO_ID,
            autocolumn: true,
            lastID: 0,
          },
        },
      })

      await config.doInContext(config.appId, async () => {
        for (const row of makeRows(30)) {
          await internalSdk.save(table._id!, row, config.user._id)
        }
        await Promise.all(
          makeRows(200).map(row =>
            internalSdk.save(table._id!, row, config.user._id)
          )
        )
        for (const row of makeRows(20)) {
          await internalSdk.save(table._id!, row, config.user._id)
        }
      })

      const persistedRows = await config.getRows(table._id!)
      expect(persistedRows).toHaveLength(250)

      const persistedTable = await config.getTable(table._id)
      expect((table as any).schema.id.lastID).toBe(0)
      expect(persistedTable.schema.id.lastID).toBe(250)
    })
  })
})
