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
import { generator } from "@budibase/backend-core/tests"
import { utils } from "@budibase/backend-core"
import { GenericContainer } from "testcontainers"

const config = setup.getConfig()!

jest.setTimeout(30000)

jest.unmock("pg")

describe("row api - postgres", () => {
  let makeRequest: MakeRequestResponse,
    postgresDatasource: Datasource,
    primaryPostgresTable: Table,
    auxPostgresTable: Table

  let host: string
  let port: number

  beforeAll(async () => {
    const container = await new GenericContainer("postgres")
      .withExposedPorts(5432)
      .withEnv("POSTGRES_PASSWORD", "password")
      .start()

    host = container.getContainerIpAddress()
    port = container.getMappedPort(5432)

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
          password: "password",
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

    primaryPostgresTable = await config.createTable({
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

  function generateRandomPrimaryRowData() {
    return {
      name: generator.name(),
      description: generator.paragraph(),
      value: generator.age(),
    }
  }

  type PrimaryRowData = {
    name: string
    description: string
    value: number
  }

  async function createPrimaryRow(opts: {
    rowData: PrimaryRowData
    createForeignRow?: boolean
  }) {
    let { rowData } = opts
    let foreignRow: Row | undefined
    if (opts?.createForeignRow) {
      foreignRow = await config.createRow({
        tableId: auxPostgresTable._id,
        title: generator.name(),
      })

      rowData = {
        ...rowData,
        [`fk_${auxPostgresTable.name}_foreignField`]: foreignRow.id,
      }
    }

    const row = await config.createRow({
      tableId: primaryPostgresTable._id,
      ...rowData,
    })

    return { row, foreignRow }
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

  async function populatePrimaryRows(
    count: number,
    opts?: {
      createForeignRow?: boolean
    }
  ) {
    return await Promise.all(
      Array(count)
        .fill({})
        .map(async () => {
          const rowData = generateRandomPrimaryRowData()
          return {
            rowData,
            ...(await createPrimaryRow({
              rowData,
              createForeignRow: opts?.createForeignRow,
            })),
          }
        })
    )
  }

  it("validate table schema", async () => {
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

  describe("POST /api/:tableId/rows", () => {
    const createRow = (tableId: string | undefined, body: object) =>
      makeRequest("post", `/api/${tableId}/rows`, body)

    describe("given than no row exists", () => {
      it("adding a new one persists it", async () => {
        const newRow = generateRandomPrimaryRowData()

        const res = await createRow(primaryPostgresTable._id, newRow)

        expect(res.status).toBe(200)

        const persistedRows = await config.getRows(primaryPostgresTable._id!)
        expect(persistedRows).toHaveLength(1)

        const expected = {
          ...res.body,
          ...newRow,
        }

        expect(persistedRows).toEqual([expect.objectContaining(expected)])
      })

      it("multiple rows can be persisted", async () => {
        const numberOfRows = 10
        const newRows = Array(numberOfRows).fill(generateRandomPrimaryRowData())

        for (const newRow of newRows) {
          const res = await createRow(primaryPostgresTable._id, newRow)
          expect(res.status).toBe(200)
        }

        const persistedRows = await config.getRows(primaryPostgresTable._id!)
        expect(persistedRows).toHaveLength(numberOfRows)
        expect(persistedRows).toEqual(
          expect.arrayContaining(newRows.map(expect.objectContaining))
        )
      })
    })
  })

  describe("PATCH /api/:tableId/rows", () => {
    const updateRow = (tableId: string | undefined, body: Row) =>
      makeRequest("patch", `/api/${tableId}/rows`, body)

    describe("given than a row exists", () => {
      let row: Row
      beforeEach(async () => {
        let rowResponse = _.sample(await populatePrimaryRows(10))!
        row = rowResponse.row
      })

      it("updating it persists it", async () => {
        const newName = generator.name()
        const newValue = generator.age()
        const updatedRow = {
          ...row,
          name: newName,
          value: newValue,
        }

        const res = await updateRow(primaryPostgresTable._id, updatedRow)

        expect(res.status).toBe(200)
        expect(res.body).toEqual(updatedRow)

        const persistedRow = await config.getRow(
          primaryPostgresTable._id!,
          row.id
        )

        expect(persistedRow).toEqual(
          expect.objectContaining({
            id: row.id,
            name: newName,
            value: newValue,
          })
        )
      })
    })
  })

  describe("DELETE /api/:tableId/rows", () => {
    const deleteRow = (
      tableId: string | undefined,
      body: Row | { rows: Row[] }
    ) => makeRequest("delete", `/api/${tableId}/rows`, body)

    describe("given than multiple row exist", () => {
      const numberOfInitialRows = 5
      let rows: Row[]
      beforeEach(async () => {
        rows = (await populatePrimaryRows(numberOfInitialRows)).map(x => x.row)
      })

      it("delete request removes it", async () => {
        const row = _.sample(rows)!
        const res = await deleteRow(primaryPostgresTable._id, row)

        expect(res.status).toBe(200)

        const persistedRows = await config.getRows(primaryPostgresTable._id!)
        expect(persistedRows).toHaveLength(numberOfInitialRows - 1)

        expect(row.id).toBeDefined()
        expect(persistedRows).not.toContain(
          expect.objectContaining({ _id: row.id })
        )
      })

      it("multiple rows can be removed at once", async () => {
        let rowsToDelete = _.sampleSize(rows, 3)!

        const res = await deleteRow(primaryPostgresTable._id, {
          rows: rowsToDelete,
        })

        expect(res.status).toBe(200)

        const persistedRows = await config.getRows(primaryPostgresTable._id!)
        expect(persistedRows).toHaveLength(numberOfInitialRows - 3)

        for (const row of rowsToDelete) {
          expect(persistedRows).not.toContain(
            expect.objectContaining({ _id: row.id })
          )
        }
      })
    })
  })

  describe("GET /api/:tableId/rows/:rowId", () => {
    const getRow = (tableId: string | undefined, rowId?: string | undefined) =>
      makeRequest("get", `/api/${tableId}/rows/${rowId}`)

    describe("given than a table have a single row", () => {
      let rowData: PrimaryRowData, row: Row
      beforeEach(async () => {
        const [createdRow] = await populatePrimaryRows(1)
        rowData = createdRow.rowData
        row = createdRow.row
      })

      it("the row can be retrieved successfully", async () => {
        const res = await getRow(primaryPostgresTable._id, row.id)

        expect(res.status).toBe(200)

        expect(res.body).toEqual(expect.objectContaining(rowData))
      })
    })

    describe("given than a table have a multiple rows", () => {
      let rows: { row: Row; rowData: PrimaryRowData }[]

      beforeEach(async () => {
        rows = await populatePrimaryRows(10)
      })

      it("a single row can be retrieved successfully", async () => {
        const { rowData, row } = _.sample(rows)!

        const res = await getRow(primaryPostgresTable._id, row.id)

        expect(res.status).toBe(200)

        expect(res.body).toEqual(expect.objectContaining(rowData))
      })
    })

    describe("given a row with relation data", () => {
      let row: Row
      let foreignRow: Row
      beforeEach(async () => {
        let [createdRow] = await populatePrimaryRows(1, {
          createForeignRow: true,
        })
        row = createdRow.row
        foreignRow = createdRow.foreignRow!
      })

      it("only foreign keys are retrieved", async () => {
        const res = await getRow(primaryPostgresTable._id, row.id)

        expect(res.status).toBe(200)

        expect(res.body).toEqual({
          ...row,
          _id: expect.any(String),
          _rev: expect.any(String),
        })

        expect(res.body.foreignField).toBeUndefined()

        expect(
          res.body[`fk_${auxPostgresTable.name}_foreignField`]
        ).toBeDefined()
        expect(res.body[`fk_${auxPostgresTable.name}_foreignField`]).toBe(
          foreignRow.id
        )
      })
    })
  })

  describe("POST /api/:tableId/search", () => {
    const search = (tableId: string | undefined, body?: object) =>
      makeRequest("post", `/api/${tableId}/search`, body)

    describe("search without parameters", () => {
      describe("given than a table has no rows", () => {
        it("search without query returns empty", async () => {
          const res = await search(primaryPostgresTable._id)

          expect(res.status).toBe(200)

          expect(res.body).toEqual({
            rows: [],
            bookmark: null,
            hasNextPage: false,
          })
        })
      })

      describe("given than a table has multiple rows", () => {
        const rowsCount = 6
        let rows: {
          row: Row
          rowData: PrimaryRowData
        }[]
        beforeEach(async () => {
          rows = await populatePrimaryRows(rowsCount)
        })

        it("search without query returns all of them", async () => {
          const res = await search(primaryPostgresTable._id)

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
      })

      describe("given than multiple tables have multiple rows", () => {
        const rowsCount = 6
        beforeEach(async () => {
          const createRandomTableWithRows = async () =>
            await config.createRow({
              tableId: (await createDefaultPgTable())._id,
              title: generator.name(),
            })

          await createRandomTableWithRows()
          await createRandomTableWithRows()

          await populatePrimaryRows(rowsCount)

          await createRandomTableWithRows()
        })
        it("search only return the requested ones", async () => {
          const res = await search(primaryPostgresTable._id)

          expect(res.status).toBe(200)

          expect(res.body.rows).toHaveLength(rowsCount)
        })
      })
    })

    it("Querying by a string field returns the rows with field containing or starting by that value", async () => {
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

      await populatePrimaryRows(3)
      for (const row of rowsToFilter) {
        await createPrimaryRow({
          rowData: row,
        })
      }
      await populatePrimaryRows(1)

      const res = await search(primaryPostgresTable._id, {
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

    it("Querying respects the limit fields", async () => {
      await populatePrimaryRows(6)

      const res = await search(primaryPostgresTable._id, {
        limit: 2,
      })

      expect(res.status).toBe(200)

      expect(res.body.rows).toHaveLength(2)
    })

    describe("sort", () => {
      beforeEach(async () => {
        const defaultValue = generateRandomPrimaryRowData()

        await createPrimaryRow({
          rowData: {
            ...defaultValue,
            name: "d",
            value: 3,
          },
        })
        await createPrimaryRow({
          rowData: { ...defaultValue, name: "aaa", value: 40 },
        })
        await createPrimaryRow({
          rowData: { ...defaultValue, name: "ccccc", value: -5 },
        })
        await createPrimaryRow({
          rowData: { ...defaultValue, name: "bb", value: 0 },
        })
      })

      it("Querying respects the sort order when sorting ascending by a string value", async () => {
        const res = await search(primaryPostgresTable._id, {
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

      it("Querying respects the sort order when sorting descending by a string value", async () => {
        const res = await search(primaryPostgresTable._id, {
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

      it("Querying respects the sort order when sorting ascending by a numeric value", async () => {
        const res = await search(primaryPostgresTable._id, {
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

      it("Querying respects the sort order when sorting descending by a numeric value", async () => {
        const res = await search(primaryPostgresTable._id, {
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

  describe("GET /api/:tableId/:rowId/enrich", () => {
    const getAll = (tableId: string | undefined, rowId: string | undefined) =>
      makeRequest("get", `/api/${tableId}/${rowId}/enrich`)
    describe("given a row with relation data", () => {
      let row: Row, foreignRow: Row | undefined

      beforeEach(async () => {
        const rowsInfo = await createPrimaryRow({
          rowData: generateRandomPrimaryRowData(),
          createForeignRow: true,
        })

        row = rowsInfo.row
        foreignRow = rowsInfo.foreignRow
      })

      it("enrich populates the foreign field", async () => {
        const res = await getAll(primaryPostgresTable._id, row.id)

        expect(res.status).toBe(200)

        expect(foreignRow).toBeDefined()
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
  })

  describe("GET /api/:tableId/rows", () => {
    const getAll = (tableId: string | undefined) =>
      makeRequest("get", `/api/${tableId}/rows`)

    describe("given a table with no rows", () => {
      it("get request returns empty", async () => {
        const res = await getAll(primaryPostgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body).toHaveLength(0)
      })
    })
    describe("given a table with multiple rows", () => {
      const rowsCount = 6
      let rows: {
        row: Row
        foreignRow: Row | undefined
        rowData: PrimaryRowData
      }[]
      beforeEach(async () => {
        rows = await populatePrimaryRows(rowsCount)
      })

      it("get request returns all of them", async () => {
        const res = await getAll(primaryPostgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body).toHaveLength(rowsCount)
        expect(res.body).toEqual(
          expect.arrayContaining(
            rows.map(r => expect.objectContaining(r.rowData))
          )
        )
      })
    })

    describe("given multiple tables with multiple rows", () => {
      const rowsCount = 6

      beforeEach(async () => {
        const createRandomTableWithRows = async () =>
          await config.createRow({
            tableId: (await createDefaultPgTable())._id,
            title: generator.name(),
          })

        await createRandomTableWithRows()
        await populatePrimaryRows(rowsCount)
        await createRandomTableWithRows()
      })

      it("get returns the requested ones", async () => {
        const res = await getAll(primaryPostgresTable._id)

        expect(res.status).toBe(200)

        expect(res.body).toHaveLength(rowsCount)
      })
    })
  })
})
