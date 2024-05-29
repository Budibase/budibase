import fetch from "node-fetch"
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
  TableSourceType,
} from "@budibase/types"
import _ from "lodash"
import { generator } from "@budibase/backend-core/tests"
import { utils } from "@budibase/backend-core"
import {
  DatabaseName,
  getDatasource,
  rawQuery,
} from "../integrations/tests/utils"

// @ts-ignore
fetch.mockSearch()

const config = setup.getConfig()!

jest.mock("../websockets")

describe("postgres integrations", () => {
  let makeRequest: MakeRequestResponse,
    rawDatasource: Datasource,
    datasource: Datasource,
    primaryPostgresTable: Table,
    oneToManyRelationshipInfo: ForeignTableInfo,
    manyToOneRelationshipInfo: ForeignTableInfo,
    manyToManyRelationshipInfo: ForeignTableInfo

  beforeAll(async () => {
    await config.init()
    const apiKey = await config.generateApiKey()

    makeRequest = generateMakeRequest(apiKey, true)

    rawDatasource = await getDatasource(DatabaseName.POSTGRES)
    datasource = await config.api.datasource.create(rawDatasource)
  })

  beforeEach(async () => {
    async function createAuxTable(prefix: string) {
      return await config.createTable({
        name: `${prefix}_${generator
          .guid()
          .replaceAll("-", "")
          .substring(0, 6)}`,
        type: "table",
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
        sourceId: datasource._id,
        sourceType: TableSourceType.EXTERNAL,
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
      name: `p_${generator.guid().replaceAll("-", "").substring(0, 6)}`,
      type: "table",
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
      sourceId: datasource._id,
      sourceType: TableSourceType.EXTERNAL,
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
      name: generator.guid().replaceAll("-", "").substring(0, 10),
      type: "table",
      primary: ["id"],
      schema: {
        id: {
          name: "id",
          type: FieldType.AUTO,
          autocolumn: true,
        },
      },
      sourceId: datasource._id,
      sourceType: TableSourceType.EXTERNAL,
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
    const res = await makeRequest("get", `/api/datasources/${datasource._id}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      config: {
        ca: false,
        database: expect.any(String),
        host: datasource.config!.host,
        password: "--secret-value--",
        port: datasource.config!.port,
        rejectUnauthorized: false,
        schema: "public",
        ssl: false,
        user: "postgres",
      },
      plus: true,
      source: "POSTGRES",
      isSQL: true,
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

        const persistedRow = await config.api.row.get(
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
              },
            ],
          })
          expect(m2mRow2).toEqual({
            ...foreignRowsByType[RelationshipType.MANY_TO_MANY][1].row,
            [m2mFieldName]: [
              {
                _id: row._id,
              },
            ],
          })
          const m2oRel = {
            [m2oFieldName]: [
              {
                _id: row._id,
              },
            ],
          }
          expect(res.body[m2oFieldName]).toEqual([
            {
              ...m2oRel,
              ...foreignRowsByType[RelationshipType.MANY_TO_ONE][0].row,
              [`fk_${manyToOneRelationshipInfo.table.name}_${manyToOneRelationshipInfo.fieldName}`]:
                row.id,
            },
            {
              ...m2oRel,
              ...foreignRowsByType[RelationshipType.MANY_TO_ONE][1].row,
              [`fk_${manyToOneRelationshipInfo.table.name}_${manyToOneRelationshipInfo.fieldName}`]:
                row.id,
            },
            {
              ...m2oRel,
              ...foreignRowsByType[RelationshipType.MANY_TO_ONE][2].row,
              [`fk_${manyToOneRelationshipInfo.table.name}_${manyToOneRelationshipInfo.fieldName}`]:
                row.id,
            },
          ])
          const o2mRel = {
            [o2mFieldName]: [
              {
                _id: row._id,
              },
            ],
          }
          expect(res.body[o2mFieldName]).toEqual([
            {
              ...o2mRel,
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
      await config.api.datasource.verify(
        {
          datasource: await getDatasource(DatabaseName.POSTGRES),
        },
        {
          body: {
            connected: true,
          },
        }
      )
    })

    it("should state an invalid datasource cannot connect", async () => {
      const dbConfig = await getDatasource(DatabaseName.POSTGRES)
      await config.api.datasource.verify(
        {
          datasource: {
            ...dbConfig,
            config: {
              ...dbConfig.config,
              password: "wrongpassword",
            },
          },
        },
        {
          body: {
            connected: false,
            error: 'password authentication failed for user "postgres"',
          },
        }
      )
    })
  })

  describe("POST /api/datasources/info", () => {
    it("should fetch information about postgres datasource", async () => {
      const primaryName = primaryPostgresTable.name
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: datasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames.indexOf(primaryName)).not.toBe(-1)
    })
  })

  describe("POST /api/datasources/:datasourceId/schema", () => {
    let tableName: string

    beforeEach(async () => {
      tableName = generator.guid().replaceAll("-", "").substring(0, 10)
    })

    afterEach(async () => {
      await rawQuery(rawDatasource, `DROP TABLE IF EXISTS "${tableName}"`)
    })

    it("recognises when a table has no primary key", async () => {
      await rawQuery(rawDatasource, `CREATE TABLE "${tableName}" (id SERIAL)`)

      const response = await makeRequest(
        "post",
        `/api/datasources/${datasource._id}/schema`
      )

      expect(response.body.errors).toEqual({
        [tableName]: "Table must have a primary key.",
      })
    })

    it("recognises when a table is using a reserved column name", async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${tableName}" (_id SERIAL PRIMARY KEY) `
      )

      const response = await makeRequest(
        "post",
        `/api/datasources/${datasource._id}/schema`
      )

      expect(response.body.errors).toEqual({
        [tableName]: "Table contains invalid columns.",
      })
    })

    it("recognises enum columns as options", async () => {
      const tableName = `orders_${generator
        .guid()
        .replaceAll("-", "")
        .substring(0, 6)}`
      const enumColumnName = "status"

      await rawQuery(
        rawDatasource,
        `
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        
        CREATE TABLE ${tableName} (
          order_id SERIAL PRIMARY KEY,
          customer_name VARCHAR(100) NOT NULL,
          ${enumColumnName} order_status
        );
      `
      )

      const response = await makeRequest(
        "post",
        `/api/datasources/${datasource._id}/schema`
      )

      const table = response.body.datasource.entities[tableName]

      expect(table).toBeDefined()
      expect(table.schema[enumColumnName].type).toEqual(FieldType.OPTIONS)
    })
  })

  describe("Integration compatibility with postgres search_path", () => {
    let rawDatasource: Datasource,
      datasource: Datasource,
      schema1: string,
      schema2: string

    beforeEach(async () => {
      schema1 = generator.guid().replaceAll("-", "")
      schema2 = generator.guid().replaceAll("-", "")

      rawDatasource = await getDatasource(DatabaseName.POSTGRES)
      const dbConfig = rawDatasource.config!

      await rawQuery(rawDatasource, `CREATE SCHEMA "${schema1}";`)
      await rawQuery(rawDatasource, `CREATE SCHEMA "${schema2}";`)

      const pathConfig: any = {
        ...rawDatasource,
        config: {
          ...dbConfig,
          schema: `${schema1}, ${schema2}`,
        },
      }
      datasource = await config.api.datasource.create(pathConfig)
    })

    afterEach(async () => {
      await rawQuery(rawDatasource, `DROP SCHEMA "${schema1}" CASCADE;`)
      await rawQuery(rawDatasource, `DROP SCHEMA "${schema2}" CASCADE;`)
    })

    it("discovers tables from any schema in search path", async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema1}".table1 (id1 SERIAL PRIMARY KEY);`
      )
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema2}".table2 (id2 SERIAL PRIMARY KEY);`
      )
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: datasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames).toEqual(
        expect.arrayContaining(["table1", "table2"])
      )
    })

    it("does not mix columns from different tables", async () => {
      const repeated_table_name = "table_same_name"
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema1}".${repeated_table_name} (id SERIAL PRIMARY KEY, val1 TEXT);`
      )
      await rawQuery(
        rawDatasource,
        `CREATE TABLE "${schema2}".${repeated_table_name} (id2 SERIAL PRIMARY KEY, val2 TEXT);`
      )
      const response = await makeRequest(
        "post",
        `/api/datasources/${datasource._id}/schema`,
        {
          tablesFilter: [repeated_table_name],
        }
      )
      expect(response.status).toBe(200)
      expect(
        response.body.datasource.entities[repeated_table_name].schema
      ).toBeDefined()
      const schema =
        response.body.datasource.entities[repeated_table_name].schema
      expect(Object.keys(schema).sort()).toEqual(["id", "val1"])
    })
  })

  describe("check custom column types", () => {
    beforeAll(async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE binaryTable (
          id BYTEA PRIMARY KEY,
          column1 TEXT,
          column2 INT
        );
      `
      )
    })

    it("should handle binary columns", async () => {
      const response = await makeRequest(
        "post",
        `/api/datasources/${datasource._id}/schema`
      )
      expect(response.body).toBeDefined()
      expect(response.body.datasource.entities).toBeDefined()
      const table = response.body.datasource.entities["binarytable"]
      expect(table).toBeDefined()
      expect(table.schema.id.externalType).toBe("bytea")
      const row = await config.api.row.save(table._id, {
        id: "1111",
        column1: "hello",
        column2: 222,
      })
      expect(row._id).toBeDefined()
      const decoded = decodeURIComponent(row._id!).replace(/'/g, '"')
      expect(JSON.parse(decoded)[0]).toBe("1111")
    })
  })
})
