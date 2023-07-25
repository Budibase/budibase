import { FieldType, Row, Table } from "@budibase/types"
import TestConfiguration from "../../../../../tests/utilities/TestConfiguration"
import { SearchParams } from "../../search"
import { search } from "../internal"
import { generator } from "@budibase/backend-core/tests"

describe("internal", () => {
  const config = new TestConfiguration()

  const tableData: Table = {
    name: generator.word(),
    type: "table",
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

  beforeAll(async () => {
    await config.init()
  })

  describe("search", () => {
    const rows: Row[] = []
    beforeAll(async () => {
      await config.createTable(tableData)
      for (let i = 0; i < 10; i++) {
        rows.push(
          await config.createRow({
            name: generator.first(),
            surname: generator.last(),
            age: generator.age(),
            address: generator.address(),
          })
        )
      }
    })

    it("default search returns all the data", async () => {
      await config.doInContext(config.appId, async () => {
        const tableId = config.table!._id!

        const searchParams: SearchParams = {
          tableId,
          query: {},
        }
        const result = await search(searchParams)

        expect(result.rows).toHaveLength(10)
        expect(result.rows).toEqual(
          expect.arrayContaining(rows.map(r => expect.objectContaining(r)))
        )
      })
    })
  })
})
