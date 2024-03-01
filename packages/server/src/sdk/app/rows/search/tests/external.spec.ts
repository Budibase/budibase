import { GenericContainer } from "testcontainers"

import {
  Datasource,
  FieldType,
  Row,
  SourceName,
  Table,
  SearchParams,
  TableSourceType,
} from "@budibase/types"

import TestConfiguration from "../../../../../tests/utilities/TestConfiguration"
import { search } from "../external"
import {
  expectAnyExternalColsAttributes,
  generator,
} from "@budibase/backend-core/tests"

jest.unmock("mysql2/promise")

jest.setTimeout(30000)

describe.skip("external", () => {
  const config = new TestConfiguration()

  let externalDatasource: Datasource, tableData: Table

  beforeAll(async () => {
    const container = await new GenericContainer("mysql")
      .withExposedPorts(3306)
      .withEnvironment({
        MYSQL_ROOT_PASSWORD: "admin",
        MYSQL_DATABASE: "db",
        MYSQL_USER: "user",
        MYSQL_PASSWORD: "password",
      })
      .start()

    const host = container.getHost()
    const port = container.getMappedPort(3306)

    await config.init()

    externalDatasource = await config.createDatasource({
      datasource: {
        type: "datasource",
        name: "Test",
        source: SourceName.MYSQL,
        plus: true,
        config: {
          host,
          port,
          user: "user",
          database: "db",
          password: "password",
          rejectUnauthorized: true,
        },
      },
    })

    tableData = {
      name: generator.word(),
      type: "table",
      primary: ["id"],
      sourceId: externalDatasource._id!,
      sourceType: TableSourceType.EXTERNAL,
      schema: {
        id: {
          name: "id",
          type: FieldType.AUTO,
          autocolumn: true,
        },
        name: {
          name: "name",
          type: FieldType.STRING,
        },
        surname: {
          name: "surname",
          type: FieldType.STRING,
        },
        age: {
          name: "age",
          type: FieldType.NUMBER,
        },
        address: {
          name: "address",
          type: FieldType.STRING,
        },
      },
    }
  })

  describe("search", () => {
    const rows: Row[] = []
    beforeAll(async () => {
      const table = await config.createExternalTable({
        ...tableData,
        sourceId: externalDatasource._id,
      })
      for (let i = 0; i < 10; i++) {
        rows.push(
          await config.createRow({
            tableId: table._id,
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

    it("querying by fields will always return data attribute columns", async () => {
      await config.doInContext(config.appId, async () => {
        const tableId = config.table!._id!

        const searchParams: SearchParams = {
          tableId,
          query: {},
          fields: ["name", "age"],
        }
        const result = await search(searchParams)

        expect(result.rows).toHaveLength(10)
        expect(result.rows).toEqual(
          expect.arrayContaining(
            rows.map(r => ({
              ...expectAnyExternalColsAttributes,
              name: r.name,
              age: r.age,
            }))
          )
        )
      })
    })

    it("will decode _id in oneOf query", async () => {
      await config.doInContext(config.appId, async () => {
        const tableId = config.table!._id!

        const searchParams: SearchParams = {
          tableId,
          query: {
            oneOf: {
              _id: ["%5B1%5D", "%5B4%5D", "%5B8%5D"],
            },
          },
        }
        const result = await search(searchParams)

        expect(result.rows).toHaveLength(3)
        expect(result.rows).toEqual(
          expect.arrayContaining(rows.map(row => [1, 4, 8].includes(row.id)))
        )
      })
    })
  })
})
