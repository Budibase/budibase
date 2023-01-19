import { faker } from "@faker-js/faker"
import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"

import * as setup from "../api/routes/tests/utilities"
import { Datasource, FieldType, SourceName, Table } from "@budibase/types"
import _ from "lodash"

const config = setup.getConfig()

jest.unmock("node-fetch")

describe("row api - postgres", () => {
  let apiKey,
    makeRequest: MakeRequestResponse,
    postgresDatasource: Datasource,
    postgresTable: Table

  beforeEach(async () => {
    await config.init()
    apiKey = await config.generateApiKey()
    postgresDatasource = await config.createDatasource({
      type: "datasource",
      source: SourceName.POSTGRES,
      plus: true,
      config: {
        host: "192.168.1.98",
        port: 54321,
        database: "postgres",
        user: "root",
        password: "root",
        schema: "public",
        ssl: false,
        rejectUnauthorized: false,
        ca: false,
      },
    })

    makeRequest = generateMakeRequest(apiKey)

    postgresTable = await config.createTable({
      name: faker.lorem.word(),
      schema: {
        name: {
          name: "name",
          type: FieldType.STRING,
          constraints: {
            presence: true,
          },
        },
        description: {
          name: "description",
          type: FieldType.STRING,
        },
        value: {
          name: "value",
          type: FieldType.NUMBER,
        },
      },
      sourceId: postgresDatasource._id,
    })
  })

  afterAll(async () => {
    await config.end()
  })

  function createRandomRow() {
    return {
      name: faker.name.fullName(),
      description: faker.lorem.paragraphs(),
      value: +faker.random.numeric(),
    }
  }

  function createRow(
    row: {
      name: string
      description: string
      value: number
    },
    tableId?: string
  ) {
    return config.createRow({
      tableId: tableId || postgresTable._id,
      ...row,
    })
  }

  async function populateRows(count: number, tableId?: string) {
    return await Promise.all(
      Array(count)
        .fill({})
        .map(async () => {
          const rowData = createRandomRow()
          return {
            rowData,
            row: await createRow(rowData, tableId || postgresTable._id),
          }
        })
    )
  }

  describe("create a row", () => {
    test("Given than no row exists, adding a new row persists it", async () => {
      const newRow = createRandomRow()

      const res = await makeRequest(
        "post",
        `/tables/${postgresTable._id}/rows`,
        newRow
      )

      expect(res.status).toBe(200)

      const persistedRows = await config.getRows(postgresTable._id!)
      expect(persistedRows).toHaveLength(1)
      expect(persistedRows).toEqual([
        expect.objectContaining({
          ...res.body.data,
          ...newRow,
        }),
      ])
    })

    test("Given than no row exists, multiple rows can be persisted", async () => {
      const numberOfRows = 10
      const newRows = Array(numberOfRows).fill(createRandomRow())

      for (const newRow of newRows) {
        const res = await makeRequest(
          "post",
          `/tables/${postgresTable._id}/rows`,
          newRow
        )
        expect(res.status).toBe(200)
      }

      const persistedRows = await config.getRows(postgresTable._id!)
      expect(persistedRows).toHaveLength(numberOfRows)
      expect(persistedRows).toEqual(
        expect.arrayContaining(newRows.map(expect.objectContaining))
      )
    })
  })

  describe("update a row", () => {
    test("Given than a row exists, updating it persists it", async () => {
      let { rowData, row } = _.sample(await populateRows(10))!

      const newName = faker.random.words(3)
      const newValue = +faker.random.numeric()
      const updateRow = {
        name: newName,
        value: newValue,
      }

      const res = await makeRequest(
        "put",
        `/tables/${postgresTable._id}/rows/${row._id}`,
        updateRow
      )

      expect(res.status).toBe(200)

      const persistedRow = await config.getRow(postgresTable._id!, row._id!)

      expect(persistedRow).toEqual(
        expect.objectContaining({
          ...res.body.data,
          ...rowData,
          ...updateRow,
        })
      )
    })
  })

  describe("delete a row", () => {
    test("Given than a row exists, delete request removes it", async () => {
      const numberOfInitialRows = 5
      let { row } = _.sample(await populateRows(numberOfInitialRows))!

      const res = await makeRequest(
        "delete",
        `/tables/${postgresTable._id}/rows/${row._id}`
      )

      expect(res.status).toBe(200)

      const persistedRows = await config.getRows(postgresTable._id!)
      expect(persistedRows).toHaveLength(numberOfInitialRows - 1)

      expect(row._id).toBeDefined()
      expect(persistedRows).not.toContain(
        expect.objectContaining({ _id: row._id })
      )
    })
  })

  describe("retrieve a row", () => {
    test("Given than a table have a single row, the row can be retrieved successfully", async () => {
      const [{ rowData, row }] = await populateRows(1)

      const res = await makeRequest(
        "get",
        `/tables/${postgresTable._id}/rows/${row._id}`
      )

      expect(res.status).toBe(200)

      expect(res.body.data).toEqual(expect.objectContaining(rowData))
    })

    test("Given than a table have a multiple rows, a single row can be retrieved successfully", async () => {
      const rows = await populateRows(10)
      const { rowData, row } = _.sample(rows)!

      const res = await makeRequest(
        "get",
        `/tables/${postgresTable._id}/rows/${row._id}`
      )

      expect(res.status).toBe(200)

      expect(res.body.data).toEqual(expect.objectContaining(rowData))
    })
  })

  describe("search for rows", () => {
    const search = (tableId: string | undefined, body?: object) =>
      makeRequest("post", `/tables/${postgresTable._id}/rows/search`, body)

    describe("empty search", () => {
      test("Given than a table has no rows, search without query returns empty", async () => {
        const res = await search(postgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body.data).toHaveLength(0)
      })

      test("Given than a table has multiple rows, search without query returns all of them", async () => {
        const rowsCount = 6
        const rows = await populateRows(rowsCount)

        const res = await search(postgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body.data).toHaveLength(rowsCount)
        expect(res.body.data).toEqual(
          expect.arrayContaining(
            rows.map(r => expect.objectContaining(r.rowData))
          )
        )
      })

      test("Given than multiple tables have multiple rows, search only return the requested ones", async () => {
        await populateRows(2, (await config.createTable())._id)
        const rowsCount = 6
        await populateRows(rowsCount)
        await populateRows(2, (await config.createTable())._id)

        const res = await search(postgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body.data).toHaveLength(rowsCount)
      })
    })

    test("Querying by a string field returns the rows with field containing or starting by that value", async () => {
      const name = faker.name.fullName()
      const rowsToFilter = [
        ...Array(2).fill({
          name,
          description: faker.lorem.paragraphs(),
          value: +faker.random.numeric(),
        }),
        ...Array(2).fill({
          name: `${name}${faker.random.alphaNumeric(5)}`,
          description: faker.lorem.paragraphs(),
          value: +faker.random.numeric(),
        }),
      ]

      await populateRows(3)
      for (const row of rowsToFilter) {
        await createRow(row, postgresTable._id)
      }
      await populateRows(1)

      const res = await search(postgresTable._id, {
        query: {
          string: {
            name,
          },
        },
      })

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(4)
      expect(res.body.data).toEqual(
        expect.arrayContaining(rowsToFilter.map(expect.objectContaining))
      )
    })

    test("Querying respects the limit fields", async () => {
      await populateRows(6)

      const res = await search(postgresTable._id, {
        limit: 2,
      })

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(2)
    })

    describe("sort", () => {
      beforeEach(async () => {
        const defaultValue = createRandomRow()

        await createRow(
          {
            ...defaultValue,
            name: "d",
            value: 3,
          },
          postgresTable._id
        )
        await createRow(
          { ...defaultValue, name: "aaa", value: 40 },
          postgresTable._id
        )
        await createRow(
          { ...defaultValue, name: "ccccc", value: -5 },
          postgresTable._id
        )
        await createRow(
          { ...defaultValue, name: "bb", value: 0 },
          postgresTable._id
        )
      })

      test("Querying respects the sort order when sorting ascending by a string value", async () => {
        const res = await search(postgresTable._id, {
          sort: {
            order: "ascending",
            column: "name",
            type: "string",
          },
        })

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([
          expect.objectContaining({ name: "aaa" }),
          expect.objectContaining({ name: "bb" }),
          expect.objectContaining({ name: "ccccc" }),
          expect.objectContaining({ name: "d" }),
        ])
      })

      test("Querying respects the sort order when sorting descending by a string value", async () => {
        const res = await search(postgresTable._id, {
          sort: {
            order: "descending",
            column: "name",
            type: "string",
          },
        })

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([
          expect.objectContaining({ name: "d" }),
          expect.objectContaining({ name: "ccccc" }),
          expect.objectContaining({ name: "bb" }),
          expect.objectContaining({ name: "aaa" }),
        ])
      })

      test("Querying respects the sort order when sorting ascending by a numeric value", async () => {
        const res = await search(postgresTable._id, {
          sort: {
            order: "ascending",
            column: "value",
            type: "number",
          },
        })

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([
          expect.objectContaining({ value: -5 }),
          expect.objectContaining({ value: 0 }),
          expect.objectContaining({ value: 3 }),
          expect.objectContaining({ value: 40 }),
        ])
      })

      test("Querying respects the sort order when sorting descending by a numeric value", async () => {
        const res = await search(postgresTable._id, {
          sort: {
            order: "descending",
            column: "value",
            type: "number",
          },
        })

        expect(res.status).toBe(200)
        expect(res.body.data).toEqual([
          expect.objectContaining({ value: 40 }),
          expect.objectContaining({ value: 3 }),
          expect.objectContaining({ value: 0 }),
          expect.objectContaining({ value: -5 }),
        ])
      })
    })
  })

  describe("get all rows", () => {
    const getAll = (tableId: string | undefined) =>
      makeRequest("get", `/tables/${postgresTable._id}/rows`)

    test("Given than a table has no rows, get returns empty", async () => {
      const res = await getAll(postgresTable._id)

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(0)
    })

    test("Given than a table has multiple rows, get returns all of them", async () => {
      const rowsCount = 6
      const rows = await populateRows(rowsCount)

      const res = await getAll(postgresTable._id)

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(rowsCount)
      expect(res.body.data).toEqual(
        expect.arrayContaining(
          rows.map(r => expect.objectContaining(r.rowData))
        )
      )
    })

    test("Given than multiple tables have multiple rows, get returns the requested ones", async () => {
      await populateRows(2, (await config.createTable())._id)
      const rowsCount = 6
      await populateRows(rowsCount)
      await populateRows(2, (await config.createTable())._id)

      const res = await getAll(postgresTable._id)

      expect(res.status).toBe(200)

      expect(res.body.data).toHaveLength(rowsCount)
    })
  })
})
