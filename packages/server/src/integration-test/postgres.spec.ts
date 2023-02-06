import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"

import * as setup from "../api/routes/tests/utilities"
import {
  Datasource,
  FieldType,
  RelationshipTypes,
  Row,
  SourceName,
  Table,
} from "@budibase/types"
import _ from "lodash"
import { generator, structures } from "@budibase/backend-core/tests"
import { utils } from "@budibase/backend-core"

const config = setup.getConfig()!

jest.unmock("pg")

describe("row api - postgres", () => {
  let makeRequest: MakeRequestResponse,
    postgresDatasource: Datasource,
    postgresTable: Table,
    auxPostgresTable: Table

  const host = process.env.POSTGRES_HOST!
  const port = process.env.POSTGRES_PORT!

  beforeAll(async () => {
    await config.init()
    const apiKey = await config.generateApiKey()

    makeRequest = generateMakeRequest(apiKey, true)
  })

  beforeEach(async () => {
    postgresDatasource = await config.createDatasource({
      datasource: {
        type: "datasource",
        source: SourceName.POSTGRES,
        plus: true,
        config: {
          host,
          port,
          database: "postgres",
          user: "postgres",
          password: process.env.POSTGRES_PASSWORD!,
          schema: "public",
          ssl: false,
          rejectUnauthorized: false,
          ca: false,
        },
      },
    })

    auxPostgresTable = await config.createTable({
      name: generator.word({ length: 10 }),
      type: "external",
      primary: ["id"],
      schema: {
        id: {
          name: "id",
          type: FieldType.AUTO,
          constraints: {
            presence: true,
          },
        },
        title: {
          name: "title",
          type: FieldType.STRING,
          constraints: {
            presence: true,
          },
        },
      },
      sourceId: postgresDatasource._id,
    })

    postgresTable = await config.createTable({
      name: generator.word({ length: 10 }),
      type: "external",
      primary: ["id"],
      schema: {
        id: {
          name: "id",
          type: FieldType.AUTO,
          constraints: {
            presence: true,
          },
        },
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
        linkedField: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
            presence: false,
          },
          fieldName: "foreignField",
          name: "linkedField",
          relationshipType: RelationshipTypes.ONE_TO_MANY,
          tableId: auxPostgresTable._id,
        },
      },
      sourceId: postgresDatasource._id,
    })
  })

  afterAll(async () => {
    await config.end()
  })

  function makeRandomRow() {
    return {
      name: generator.name(),
      description: generator.paragraph(),
      value: generator.age(),
    }
  }

  async function createRow(
    row: {
      name: string
      description: string
      value: number
    },
    tableId?: string,
    createForeignRow?: boolean
  ) {
    if (createForeignRow) {
      const foreignRow = await config.createRow({
        tableId: auxPostgresTable._id,
        title: generator.name(),
      })

      row = {
        ...row,
        [`fk_${auxPostgresTable.name}_foreignField`]: foreignRow.id,
      }
    }

    return await config.createRow({
      tableId: tableId || postgresTable._id,
      ...row,
    })
  }

  async function createDefaultPgTable() {
    return await config.createTable({
      name: generator.word({ length: 10 }),
      type: "external",
      primary: ["id"],
      schema: {
        id: {
          name: "id",
          type: FieldType.AUTO,
          constraints: {
            presence: true,
          },
        },
      },
      sourceId: postgresDatasource._id,
    })
  }

  async function populateRows(count: number, tableId?: string) {
    return await Promise.all(
      Array(count)
        .fill({})
        .map(async () => {
          const rowData = makeRandomRow()
          return {
            rowData,
            row: await createRow(rowData, tableId || postgresTable._id),
          }
        })
    )
  }

  test("validate table schema", async () => {
    const res = await makeRequest(
      "get",
      `/api/datasources/${postgresDatasource._id}`
    )

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      config: {
        ca: false,
        database: "postgres",
        host,
        password: "--secret-value--",
        port,
        rejectUnauthorized: false,
        schema: "public",
        ssl: false,
        user: "postgres",
      },
      plus: true,
      source: "POSTGRES",
      type: "datasource",
      _id: expect.any(String),
      _rev: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      entities: expect.any(Object),
    })
  })

  describe("create a row", () => {
    const createRow = (tableId: string | undefined, body: object) =>
      makeRequest("post", `/api/${tableId}/rows`, body)

    test("Given than no row exists, adding a new row persists it", async () => {
      const newRow = makeRandomRow()

      const res = await createRow(postgresTable._id, newRow)

      expect(res.status).toBe(200)

      const persistedRows = await config.getRows(postgresTable._id!)
      expect(persistedRows).toHaveLength(1)

      const expected = {
        ...res.body,
        ...newRow,
      }

      expect(persistedRows).toEqual([expect.objectContaining(expected)])
    })

    test("Given than no row exists, multiple rows can be persisted", async () => {
      const numberOfRows = 10
      const newRows = Array(numberOfRows).fill(makeRandomRow())

      for (const newRow of newRows) {
        const res = await createRow(postgresTable._id, newRow)
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
    const updateRow = (tableId: string | undefined, body: Row) =>
      makeRequest("patch", `/api/${tableId}/rows`, body)

    test("Given than a row exists, updating it persists it", async () => {
      let { row } = _.sample(await populateRows(10))!

      const newName = generator.name()
      const newValue = generator.age()
      const updatedRow = {
        ...row,
        name: newName,
        value: newValue,
      }

      const res = await updateRow(postgresTable._id, updatedRow)

      expect(res.status).toBe(200)
      expect(res.body).toEqual(updatedRow)

      const persistedRow = await config.getRow(postgresTable._id!, row.id)

      expect(persistedRow).toEqual(
        expect.objectContaining({
          id: row.id,
          name: newName,
          value: newValue,
        })
      )
    })
  })

  describe("delete a row", () => {
    const deleteRow = (
      tableId: string | undefined,
      body: Row | { rows: Row[] }
    ) => makeRequest("delete", `/api/${tableId}/rows`, body)

    test("Given than a row exists, delete request removes it", async () => {
      const numberOfInitialRows = 5
      let { row } = _.sample(await populateRows(numberOfInitialRows))!

      const res = await deleteRow(postgresTable._id, row)

      expect(res.status).toBe(200)

      const persistedRows = await config.getRows(postgresTable._id!)
      expect(persistedRows).toHaveLength(numberOfInitialRows - 1)

      expect(row.id).toBeDefined()
      expect(persistedRows).not.toContain(
        expect.objectContaining({ _id: row.id })
      )
    })

    test("Given than multiple rows exist, multiple rows can be removed", async () => {
      const numberOfInitialRows = 5
      let rows = _.sampleSize(await populateRows(numberOfInitialRows), 3)!.map(
        x => x.row
      )

      const res = await deleteRow(postgresTable._id, { rows })

      expect(res.status).toBe(200)

      const persistedRows = await config.getRows(postgresTable._id!)
      expect(persistedRows).toHaveLength(numberOfInitialRows - 3)

      for (const row of rows) {
        expect(persistedRows).not.toContain(
          expect.objectContaining({ _id: row.id })
        )
      }
    })
  })

  describe("retrieve a row", () => {
    const getRow = (tableId: string | undefined, rowId?: string | undefined) =>
      makeRequest("get", `/api/${tableId}/rows/${rowId}`)

    test("Given than a table have a single row, the row can be retrieved successfully", async () => {
      const [{ rowData, row }] = await populateRows(1)

      const res = await getRow(postgresTable._id, row.id)

      expect(res.status).toBe(200)

      expect(res.body).toEqual(expect.objectContaining(rowData))
    })

    test("Given than a table have a multiple rows, a single row can be retrieved successfully", async () => {
      const rows = await populateRows(10)
      const { rowData, row } = _.sample(rows)!

      const res = await getRow(postgresTable._id, row.id)

      expect(res.status).toBe(200)

      expect(res.body).toEqual(expect.objectContaining(rowData))
    })

    test("given having rows with relation data, only the ids are retrieved", async () => {
      let [{ row }] = await populateRows(1)

      await config.createRow({
        tableId: auxPostgresTable._id,
        title: generator.sentence(),
        linkedField: row.id,
      })

      const res = await getRow(postgresTable._id, row.id)

      expect(res.status).toBe(200)

      expect(res.body).toEqual({
        ...row,
        _id: expect.any(String),
        _rev: expect.any(String),
      })
      expect(res.body.foreignField).toBeUndefined()
    })
  })

  describe("search for rows", () => {
    const search = (tableId: string | undefined, body?: object) =>
      makeRequest("post", `/api/${tableId}/search`, body)

    describe("empty search", () => {
      test("Given than a table has no rows, search without query returns empty", async () => {
        const res = await search(postgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body).toEqual({
          rows: [],
          bookmark: null,
          hasNextPage: false,
        })
      })

      test("Given than a table has multiple rows, search without query returns all of them", async () => {
        const rowsCount = 6
        const rows = await populateRows(rowsCount)

        const res = await search(postgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body).toEqual({
          rows: expect.arrayContaining(
            rows.map(r => expect.objectContaining(r.rowData))
          ),
          bookmark: null,
          hasNextPage: false,
        })
        expect(res.body.rows).toHaveLength(rowsCount)
      })

      test("Given than multiple tables have multiple rows, search only return the requested ones", async () => {
        await populateRows(2, (await createDefaultPgTable())._id)
        const rowsCount = 6
        await populateRows(rowsCount)
        await populateRows(2, (await createDefaultPgTable())._id)

        const res = await search(postgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body.rows).toHaveLength(rowsCount)
      })
    })

    test("Querying by a string field returns the rows with field containing or starting by that value", async () => {
      const name = generator.name()
      const rowsToFilter = [
        ...Array(2).fill({
          name,
          description: generator.paragraph(),
          value: generator.age(),
        }),
        ...Array(2).fill({
          name: `${name}${utils.newid()}`,
          description: generator.paragraph(),
          value: generator.age(),
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

      expect(res.body).toEqual({
        rows: expect.arrayContaining(rowsToFilter.map(expect.objectContaining)),
        bookmark: null,
        hasNextPage: false,
      })
      expect(res.body.rows).toHaveLength(4)
    })

    test("Querying respects the limit fields", async () => {
      await populateRows(6)

      const res = await search(postgresTable._id, {
        limit: 2,
      })

      expect(res.status).toBe(200)

      expect(res.body.rows).toHaveLength(2)
    })

    describe("sort", () => {
      beforeEach(async () => {
        const defaultValue = makeRandomRow()

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
          sort: "name",
          sortOrder: "ascending",
          sortType: "string",
        })

        expect(res.status).toBe(200)
        expect(res.body.rows).toEqual([
          expect.objectContaining({ name: "aaa" }),
          expect.objectContaining({ name: "bb" }),
          expect.objectContaining({ name: "ccccc" }),
          expect.objectContaining({ name: "d" }),
        ])
      })

      test("Querying respects the sort order when sorting descending by a string value", async () => {
        const res = await search(postgresTable._id, {
          sort: "name",
          sortOrder: "descending",
          sortType: "string",
        })

        expect(res.status).toBe(200)
        expect(res.body.rows).toEqual([
          expect.objectContaining({ name: "d" }),
          expect.objectContaining({ name: "ccccc" }),
          expect.objectContaining({ name: "bb" }),
          expect.objectContaining({ name: "aaa" }),
        ])
      })

      test("Querying respects the sort order when sorting ascending by a numeric value", async () => {
        const res = await search(postgresTable._id, {
          sort: "value",
          sortOrder: "ascending",
          sortType: "number",
        })

        expect(res.status).toBe(200)
        expect(res.body.rows).toEqual([
          expect.objectContaining({ value: -5 }),
          expect.objectContaining({ value: 0 }),
          expect.objectContaining({ value: 3 }),
          expect.objectContaining({ value: 40 }),
        ])
      })

      test("Querying respects the sort order when sorting descending by a numeric value", async () => {
        const res = await search(postgresTable._id, {
          sort: "value",
          sortOrder: "descending",
          sortType: "number",
        })

        expect(res.status).toBe(200)
        expect(res.body.rows).toEqual([
          expect.objectContaining({ value: 40 }),
          expect.objectContaining({ value: 3 }),
          expect.objectContaining({ value: 0 }),
          expect.objectContaining({ value: -5 }),
        ])
      })
    })
  })

  describe("get enriched row", () => {
    const getAll = (tableId: string | undefined, rowId: string | undefined) =>
      makeRequest("get", `/api/${tableId}/${rowId}/enrich`)

    test("given having rows with relation data, enrich populates the foreign field", async () => {
      const foreignRow = await config.createRow({
        tableId: auxPostgresTable._id,
        title: generator.name(),
      })

      const rowData = {
        ...makeRandomRow(),
        [`fk_${auxPostgresTable.name}_foreignField`]: foreignRow.id,
      }
      const row = await createRow(rowData)

      const res = await getAll(postgresTable._id, row.id)

      expect(res.status).toBe(200)

      expect(res.body).toEqual({
        ...row,
        linkedField: [
          {
            ...foreignRow,
          },
        ],
      })
    })
  })

  describe("get all rows", () => {
    const getAll = (tableId: string | undefined) =>
      makeRequest("get", `/api/${tableId}/rows`)

    test("Given than a table has no rows, get returns empty", async () => {
      const res = await getAll(postgresTable._id)

      expect(res.status).toBe(200)

      expect(res.body).toHaveLength(0)
    })

    test("Given than a table has multiple rows, get returns all of them", async () => {
      const rowsCount = 6
      const rows = await populateRows(rowsCount)

      const res = await getAll(postgresTable._id)

      expect(res.status).toBe(200)

      expect(res.body).toHaveLength(rowsCount)
      expect(res.body).toEqual(
        expect.arrayContaining(
          rows.map(r => expect.objectContaining(r.rowData))
        )
      )
    })

    test("Given than multiple tables have multiple rows, get returns the requested ones", async () => {
      await populateRows(2, (await createDefaultPgTable())._id)
      const rowsCount = 6
      await populateRows(rowsCount, postgresTable._id)
      await populateRows(2, (await createDefaultPgTable())._id)

      const res = await getAll(postgresTable._id)

      expect(res.status).toBe(200)

      expect(res.body).toHaveLength(rowsCount)
    })
  })
})
