import * as internalSdk from "../internal"

import { generator } from "@budibase/backend-core/tests"
import {
  INTERNAL_TABLE_SOURCE_ID,
  TableSourceType,
  FieldType,
  Table,
} from "@budibase/types"

import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

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
        id: {
          name: "id",
          type: FieldType.AUTO,
          autocolumn: true,
          lastID: 0,
        },
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

    it.only("can persist in parallel", async () => {
      const table = await config.createTable(tableData)
      const rows = Array.from({ length: 100 }, () => makeRow())

      await config.doInContext(config.appId, async () => {
        await Promise.all(
          rows.map(row => internalSdk.save(table._id!, row, config.user._id))
        )

        const persistedRows = await config.getRows(table._id!)
        expect(persistedRows).toHaveLength(100)
      })
    })
  })
})
