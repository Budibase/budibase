import fetch from "node-fetch"
// @ts-ignore
fetch.mockSearch()
import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"

import * as setup from "../api/routes/tests/utilities"
import {
  Datasource,
  FieldType,
  RelationshipType,
  Row,
  Table,
} from "@budibase/types"
import _ from "lodash"
import { generator } from "@budibase/backend-core/tests"
import { utils } from "@budibase/backend-core"
import { databaseTestProviders } from "../integrations/tests/utils"

const config = setup.getConfig()!

jest.unmock("pg")
jest.mock("../websockets")

describe("postgres integrations", () => {
  let makeRequest: MakeRequestResponse,
    postgresDatasource: Datasource,
    primaryPostgresTable: Table,
    oneToManyRelationshipInfo: ForeignTableInfo,
    manyToOneRelationshipInfo: ForeignTableInfo,
    manyToManyRelationshipInfo: ForeignTableInfo

  beforeAll(async () => {
    await config.init()
    const apiKey = await config.generateApiKey()

    makeRequest = generateMakeRequest(apiKey, true)

    postgresDatasource = await config.api.datasource.create(
      await databaseTestProviders.postgres.getDsConfig()
    )
  })

  afterAll(async () => {
    await databaseTestProviders.postgres.stopContainer()
  })

  beforeEach(async () => {
    async function createAuxTable(prefix: string) {
      return await config.createTable({
        name: `${prefix}_${generator.word({ length: 6 })}`,
        type: "external",
        primary: ["id"],
        primaryDisplay: "title",
        schema: {
          id: {
            name: "id",
            type: FieldType.AUTO,
            autocolumn: true,
          },
          title: {
            name: "title",
            type: FieldType.STRING,
          },
        },
        sourceId: postgresDatasource._id,
      })
    }

    oneToManyRelationshipInfo = {
      table: await createAuxTable("o2m"),
      fieldName: "oneToManyRelation",
      relationshipType: RelationshipType.ONE_TO_MANY,
    }
    manyToOneRelationshipInfo = {
      table: await createAuxTable("m2o"),
      fieldName: "manyToOneRelation",
      relationshipType: RelationshipType.MANY_TO_ONE,
    }
    manyToManyRelationshipInfo = {
      table: await createAuxTable("m2m"),
      fieldName: "manyToManyRelation",
      relationshipType: RelationshipType.MANY_TO_MANY,
    }

    primaryPostgresTable = await config.createTable({
      name: `p_${generator.word({ length: 6 })}`,
      type: "external",
      primary: ["id"],
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
        description: {
          name: "description",
          type: FieldType.STRING,
        },
        value: {
          name: "value",
          type: FieldType.NUMBER,
        },
        oneToManyRelation: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
          },
          fieldName: oneToManyRelationshipInfo.fieldName,
          name: "oneToManyRelation",
          relationshipType: RelationshipType.ONE_TO_MANY,
          tableId: oneToManyRelationshipInfo.table._id!,
          main: true,
        },
        manyToOneRelation: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
          },
          fieldName: manyToOneRelationshipInfo.fieldName,
          name: "manyToOneRelation",
          relationshipType: RelationshipType.MANY_TO_ONE,
          tableId: manyToOneRelationshipInfo.table._id!,
          main: true,
        },
        manyToManyRelation: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
          },
          fieldName: manyToManyRelationshipInfo.fieldName,
          name: "manyToManyRelation",
          relationshipType: RelationshipType.MANY_TO_MANY,
          tableId: manyToManyRelationshipInfo.table._id!,
          main: true,
        },
      },
      sourceId: postgresDatasource._id,
    })
  })

  afterAll(config.end)

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

  type ForeignTableInfo = {
    table: Table
    fieldName: string
    relationshipType: RelationshipType
  }

  type ForeignRowsInfo = {
    row: Row
    relationshipType: RelationshipType
  }

  async function createPrimaryRow(opts: {
    rowData: PrimaryRowData
    createForeignRows?: {
      createOneToMany?: boolean
      createManyToOne?: number
      createManyToMany?: number
    }
  }) {
    let { rowData } = opts as any
    let foreignRows: ForeignRowsInfo[] = []

    if (opts?.createForeignRows?.createOneToMany) {
      const foreignKey = `fk_${oneToManyRelationshipInfo.table.name}_${oneToManyRelationshipInfo.fieldName}`

      const foreignRow = await config.createRow({
        tableId: oneToManyRelationshipInfo.table._id,
        title: generator.name(),
      })

      rowData = {
        ...rowData,
        [foreignKey]: foreignRow.id,
      }
      foreignRows.push({
        row: foreignRow,
        relationshipType: oneToManyRelationshipInfo.relationshipType,
      })
    }

    for (let i = 0; i < (opts?.createForeignRows?.createManyToOne || 0); i++) {
      const foreignRow = await config.createRow({
        tableId: manyToOneRelationshipInfo.table._id,
        title: generator.name(),
      })

      rowData = {
        ...rowData,
        [manyToOneRelationshipInfo.fieldName]:
          rowData[manyToOneRelationshipInfo.fieldName] || [],
      }
      rowData[manyToOneRelationshipInfo.fieldName].push(foreignRow._id)
      foreignRows.push({
        row: foreignRow,
        relationshipType: RelationshipType.MANY_TO_ONE,
      })
    }

    for (let i = 0; i < (opts?.createForeignRows?.createManyToMany || 0); i++) {
      const foreignRow = await config.createRow({
        tableId: manyToManyRelationshipInfo.table._id,
        title: generator.name(),
      })

      rowData = {
        ...rowData,
        [manyToManyRelationshipInfo.fieldName]:
          rowData[manyToManyRelationshipInfo.fieldName] || [],
      }
      rowData[manyToManyRelationshipInfo.fieldName].push(foreignRow._id)
      foreignRows.push({
        row: foreignRow,
        relationshipType: RelationshipType.MANY_TO_MANY,
      })
    }

    const row = await config.createRow({
      tableId: primaryPostgresTable._id,
      ...rowData,
    })

    return { row, foreignRows }
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
          autocolumn: true,
        },
      },
      sourceId: postgresDatasource._id,
    })
  }

  const createRandomTableWithRows = async () => {
    const tableId = (await createDefaultPgTable())._id!
    return await config.api.row.save(tableId, {
      tableId,
      title: generator.name(),
    })
  }

  async function populatePrimaryRows(
    count: number,
    opts?: {
      createOneToMany?: boolean
      createManyToOne?: number
      createManyToMany?: number
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
              createForeignRows: opts,
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
        host: postgresDatasource.config!.host,
        password: "--secret-value--",
        port: postgresDatasource.config!.port,
        rejectUnauthorized: false,
        schema: "public",
        ssl: false,
        user: "postgres",
      },
      plus: true,
      source: "POSTGRES",
      type: "datasource_plus",
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
        const newRows: Row[] = Array(numberOfRows).fill(
          generateRandomPrimaryRowData()
        )

        await Promise.all(
          newRows.map(async newRow => {
            const res = await createRow(primaryPostgresTable._id, newRow)
            expect(res.status).toBe(200)
          })
        )

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
        let rowResponse = _.sample(await populatePrimaryRows(1))!
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
        rows = await populatePrimaryRows(5)
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
      let rowData: {
        name: string
        description: string
        value: number
      }
      let foreignRows: ForeignRowsInfo[]

      describe("with all relationship types", () => {
        beforeEach(async () => {
          let [createdRow] = await populatePrimaryRows(1, {
            createOneToMany: true,
            createManyToOne: 3,
            createManyToMany: 2,
          })
          row = createdRow.row
          rowData = createdRow.rowData
          foreignRows = createdRow.foreignRows
        })

        it("only one to primary keys are retrieved", async () => {
          const res = await getRow(primaryPostgresTable._id, row.id)

          expect(res.status).toBe(200)

          const one2ManyForeignRows = foreignRows.filter(
            x => x.relationshipType === RelationshipType.ONE_TO_MANY
          )
          const many2OneForeignRows = foreignRows.filter(
            x => x.relationshipType === RelationshipType.MANY_TO_ONE
          )
          const many2ManyForeignRows = foreignRows.filter(
            x => x.relationshipType === RelationshipType.MANY_TO_MANY
          )
          expect(one2ManyForeignRows).toHaveLength(1)

          expect(res.body).toEqual({
            ...rowData,
            id: row.id,
            tableId: row.tableId,
            _id: expect.any(String),
            _rev: expect.any(String),
            [`fk_${oneToManyRelationshipInfo.table.name}_${oneToManyRelationshipInfo.fieldName}`]:
              one2ManyForeignRows[0].row.id,
            [oneToManyRelationshipInfo.fieldName]: expect.arrayContaining(
              one2ManyForeignRows.map(r => ({
                _id: r.row._id,
                primaryDisplay: r.row.title,
              }))
            ),
            [manyToOneRelationshipInfo.fieldName]: expect.arrayContaining(
              many2OneForeignRows.map(r => ({
                _id: r.row._id,
                primaryDisplay: r.row.title,
              }))
            ),
            [manyToManyRelationshipInfo.fieldName]: expect.arrayContaining(
              many2ManyForeignRows.map(r => ({
                _id: r.row._id,
                primaryDisplay: r.row.title,
              }))
            ),
          })
        })
      })

      describe("with only one to many", () => {
        beforeEach(async () => {
          let [createdRow] = await populatePrimaryRows(1, {
            createOneToMany: true,
          })
          row = createdRow.row
          rowData = createdRow.rowData
          foreignRows = createdRow.foreignRows
        })

        it("only one to many foreign keys are retrieved", async () => {
          const res = await getRow(primaryPostgresTable._id, row.id)

          expect(res.status).toBe(200)

          expect(foreignRows).toHaveLength(1)

          expect(res.body).toEqual({
            ...rowData,
            id: row.id,
            tableId: row.tableId,
            _id: expect.any(String),
            _rev: expect.any(String),
            [`fk_${oneToManyRelationshipInfo.table.name}_${oneToManyRelationshipInfo.fieldName}`]:
              foreignRows[0].row.id,
            [oneToManyRelationshipInfo.fieldName]: expect.arrayContaining(
              foreignRows.map(r => ({
                _id: r.row._id,
                primaryDisplay: r.row.title,
              }))
            ),
          })
        })
      })

      describe("with only many to one", () => {
        beforeEach(async () => {
          let [createdRow] = await populatePrimaryRows(1, {
            createManyToOne: 3,
          })
          row = createdRow.row
          rowData = createdRow.rowData
          foreignRows = createdRow.foreignRows
        })

        it("only one to many foreign keys are retrieved", async () => {
          const res = await getRow(primaryPostgresTable._id, row.id)

          expect(res.status).toBe(200)

          expect(foreignRows).toHaveLength(3)

          expect(res.body).toEqual({
            ...rowData,
            id: row.id,
            tableId: row.tableId,
            _id: expect.any(String),
            _rev: expect.any(String),
            [manyToOneRelationshipInfo.fieldName]: expect.arrayContaining(
              foreignRows.map(r => ({
                _id: r.row._id,
                primaryDisplay: r.row.title,
              }))
            ),
          })
        })
      })

      describe("with only many to many", () => {
        beforeEach(async () => {
          let [createdRow] = await populatePrimaryRows(1, {
            createManyToMany: 2,
          })
          row = createdRow.row
          rowData = createdRow.rowData
          foreignRows = createdRow.foreignRows
        })

        it("only one to many foreign keys are retrieved", async () => {
          const res = await getRow(primaryPostgresTable._id, row.id)

          expect(res.status).toBe(200)

          expect(foreignRows).toHaveLength(2)

          expect(res.body).toEqual({
            ...rowData,
            id: row.id,
            tableId: row.tableId,
            _id: expect.any(String),
            _rev: expect.any(String),
            [manyToManyRelationshipInfo.fieldName]: expect.arrayContaining(
              foreignRows.map(r => ({
                _id: r.row._id,
                primaryDisplay: r.row.title,
              }))
            ),
          })
        })
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
      let row: Row, rowData: PrimaryRowData, foreignRows: ForeignRowsInfo[]

      describe("with all relationship types", () => {
        beforeEach(async () => {
          rowData = generateRandomPrimaryRowData()
          const rowsInfo = await createPrimaryRow({
            rowData,
            createForeignRows: {
              createOneToMany: true,
              createManyToOne: 3,
              createManyToMany: 2,
            },
          })

          row = rowsInfo.row
          foreignRows = rowsInfo.foreignRows
        })

        it("enrich populates the foreign fields", async () => {
          const res = await getAll(primaryPostgresTable._id, row.id)

          expect(res.status).toBe(200)

          const foreignRowsByType = _.groupBy(
            foreignRows,
            x => x.relationshipType
          )
          const m2mFieldName = manyToManyRelationshipInfo.fieldName,
            o2mFieldName = oneToManyRelationshipInfo.fieldName,
            m2oFieldName = manyToOneRelationshipInfo.fieldName
          const m2mRow1 = res.body[m2mFieldName].find(
            (row: Row) => row.id === 1
          )
          const m2mRow2 = res.body[m2mFieldName].find(
            (row: Row) => row.id === 2
          )
          expect(m2mRow1).toEqual({
            ...foreignRowsByType[RelationshipType.MANY_TO_MANY][0].row,
            [m2mFieldName]: [
              {
                _id: row._id,
                primaryDisplay: "Invalid display column",
              },
            ],
          })
          expect(m2mRow2).toEqual({
            ...foreignRowsByType[RelationshipType.MANY_TO_MANY][1].row,
            [m2mFieldName]: [
              {
                _id: row._id,
                primaryDisplay: "Invalid display column",
              },
            ],
          })
          expect(res.body[m2oFieldName]).toEqual([
            {
              ...foreignRowsByType[RelationshipType.MANY_TO_ONE][0].row,
              [`fk_${manyToOneRelationshipInfo.table.name}_${manyToOneRelationshipInfo.fieldName}`]:
                row.id,
            },
            {
              ...foreignRowsByType[RelationshipType.MANY_TO_ONE][1].row,
              [`fk_${manyToOneRelationshipInfo.table.name}_${manyToOneRelationshipInfo.fieldName}`]:
                row.id,
            },
            {
              ...foreignRowsByType[RelationshipType.MANY_TO_ONE][2].row,
              [`fk_${manyToOneRelationshipInfo.table.name}_${manyToOneRelationshipInfo.fieldName}`]:
                row.id,
            },
          ])
          expect(res.body[o2mFieldName]).toEqual([
            {
              ...foreignRowsByType[RelationshipType.ONE_TO_MANY][0].row,
              _id: expect.any(String),
              _rev: expect.any(String),
            },
          ])
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
        foreignRows: ForeignRowsInfo[]
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

  describe("POST /api/datasources/verify", () => {
    it("should be able to verify the connection", async () => {
      const response = await config.api.datasource.verify({
        datasource: await databaseTestProviders.postgres.getDsConfig(),
      })
      expect(response.status).toBe(200)
      expect(response.body.connected).toBe(true)
    })

    it("should state an invalid datasource cannot connect", async () => {
      const dbConfig = await databaseTestProviders.postgres.getDsConfig()
      const response = await config.api.datasource.verify({
        datasource: {
          ...dbConfig,
          config: {
            ...dbConfig.config,
            password: "wrongpassword",
          },
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.connected).toBe(false)
      expect(response.body.error).toBeDefined()
    })
  })

  describe("POST /api/datasources/info", () => {
    it("should fetch information about postgres datasource", async () => {
      const primaryName = primaryPostgresTable.name
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: postgresDatasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames.indexOf(primaryName)).not.toBe(-1)
    })
  })
})
