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
  Table,
  TableRequest,
  TableSourceType,
} from "@budibase/types"
import _ from "lodash"
import { generator } from "@budibase/backend-core/tests"
import { databaseTestProviders } from "../integrations/tests/utils"
import mysql from "mysql2/promise"
import { builderSocket } from "../websockets"
// @ts-ignore
fetch.mockSearch()

const config = setup.getConfig()!

jest.unmock("mysql2/promise")
jest.mock("../websockets", () => ({
  clientAppSocket: jest.fn(),
  gridAppSocket: jest.fn(),
  initialise: jest.fn(),
  builderSocket: {
    emitTableUpdate: jest.fn(),
    emitTableDeletion: jest.fn(),
    emitDatasourceUpdate: jest.fn(),
    emitDatasourceDeletion: jest.fn(),
    emitScreenUpdate: jest.fn(),
    emitAppMetadataUpdate: jest.fn(),
    emitAppPublish: jest.fn(),
  },
}))

describe("mysql integrations", () => {
  let makeRequest: MakeRequestResponse,
    mysqlDatasource: Datasource,
    primaryMySqlTable: Table,
    oneToManyRelationshipInfo: ForeignTableInfo,
    manyToOneRelationshipInfo: ForeignTableInfo,
    manyToManyRelationshipInfo: ForeignTableInfo

  beforeAll(async () => {
    await config.init()
    const apiKey = await config.generateApiKey()

    makeRequest = generateMakeRequest(apiKey, true)

    mysqlDatasource = await config.api.datasource.create(
      await databaseTestProviders.mysql.datasource()
    )
  })

  afterAll(async () => {
    await databaseTestProviders.mysql.stop()
  })

  beforeEach(async () => {
    async function createAuxTable(prefix: string) {
      return await config.createTable({
        name: `${prefix}_${generator.word({ length: 5 })}`,
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
        sourceId: mysqlDatasource._id,
        sourceType: TableSourceType.EXTERNAL,
      })
    }

    oneToManyRelationshipInfo = {
      table: await createAuxTable("o2m"),
      fieldName: "oneToMany",
      relationshipType: RelationshipType.ONE_TO_MANY,
    }
    manyToOneRelationshipInfo = {
      table: await createAuxTable("m2o"),
      fieldName: "manyToOne",
      relationshipType: RelationshipType.MANY_TO_ONE,
    }
    manyToManyRelationshipInfo = {
      table: await createAuxTable("m2m"),
      fieldName: "manyToMany",
      relationshipType: RelationshipType.MANY_TO_MANY,
    }

    primaryMySqlTable = await config.createTable({
      name: `p_${generator.word({ length: 5 })}`,
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
        oneToMany: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
          },
          fieldName: oneToManyRelationshipInfo.fieldName,
          name: "oneToMany",
          relationshipType: RelationshipType.ONE_TO_MANY,
          tableId: oneToManyRelationshipInfo.table._id!,
          main: true,
        },
        manyToOne: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
          },
          fieldName: manyToOneRelationshipInfo.fieldName,
          name: "manyToOne",
          relationshipType: RelationshipType.MANY_TO_ONE,
          tableId: manyToOneRelationshipInfo.table._id!,
          main: true,
        },
        manyToMany: {
          type: FieldType.LINK,
          constraints: {
            type: "array",
          },
          fieldName: manyToManyRelationshipInfo.fieldName,
          name: "manyToMany",
          relationshipType: RelationshipType.MANY_TO_MANY,
          tableId: manyToManyRelationshipInfo.table._id!,
          main: true,
        },
      },
      sourceId: mysqlDatasource._id,
      sourceType: TableSourceType.EXTERNAL,
    })
  })

  afterAll(config.end)

  type ForeignTableInfo = {
    table: Table
    fieldName: string
    relationshipType: RelationshipType
  }

  it("validate table schema", async () => {
    const res = await makeRequest(
      "get",
      `/api/datasources/${mysqlDatasource._id}`
    )

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      config: {
        database: "mysql",
        host: mysqlDatasource.config!.host,
        password: "--secret-value--",
        port: mysqlDatasource.config!.port,
        user: "root",
      },
      plus: true,
      source: "MYSQL",
      type: "datasource_plus",
      _id: expect.any(String),
      _rev: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      entities: expect.any(Object),
    })
  })

  describe("POST /api/datasources/verify", () => {
    it("should be able to verify the connection", async () => {
      const response = await config.api.datasource.verify({
        datasource: await databaseTestProviders.mysql.datasource(),
      })
      expect(response.status).toBe(200)
      expect(response.body.connected).toBe(true)
    })

    it("should state an invalid datasource cannot connect", async () => {
      const dbConfig = await databaseTestProviders.mysql.datasource()
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
    it("should fetch information about mysql datasource", async () => {
      const primaryName = primaryMySqlTable.name
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: mysqlDatasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames.indexOf(primaryName)).not.toBe(-1)
    })
  })

  describe("Integration compatibility with mysql search_path", () => {
    let client: mysql.Connection, pathDatasource: Datasource
    const database = "test1"
    const database2 = "test-2"

    beforeAll(async () => {
      const dsConfig = await databaseTestProviders.mysql.datasource()
      const dbConfig = dsConfig.config!

      client = await mysql.createConnection(dbConfig)
      await client.query(`CREATE DATABASE \`${database}\`;`)
      await client.query(`CREATE DATABASE \`${database2}\`;`)

      const pathConfig: any = {
        ...dsConfig,
        config: {
          ...dbConfig,
          database,
        },
      }
      pathDatasource = await config.api.datasource.create(pathConfig)
    })

    afterAll(async () => {
      await client.query(`DROP DATABASE \`${database}\`;`)
      await client.query(`DROP DATABASE \`${database2}\`;`)
      await client.end()
    })

    it("discovers tables from any schema in search path", async () => {
      await client.query(
        `CREATE TABLE \`${database}\`.table1 (id1 SERIAL PRIMARY KEY);`
      )
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: pathDatasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames).toEqual(
        expect.arrayContaining(["table1"])
      )
    })

    it("does not mix columns from different tables", async () => {
      const repeated_table_name = "table_same_name"
      await client.query(
        `CREATE TABLE \`${database}\`.${repeated_table_name} (id SERIAL PRIMARY KEY, val1 TEXT);`
      )
      await client.query(
        `CREATE TABLE \`${database2}\`.${repeated_table_name} (id2 SERIAL PRIMARY KEY, val2 TEXT);`
      )
      const response = await makeRequest(
        "post",
        `/api/datasources/${pathDatasource._id}/schema`,
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

  describe("POST /api/tables/", () => {
    let client: mysql.Connection
    const emitDatasourceUpdateMock = jest.fn()

    beforeEach(async () => {
      client = await mysql.createConnection(
        (
          await databaseTestProviders.mysql.datasource()
        ).config!
      )
    })

    afterEach(async () => {
      await client.end()
    })

    it("will emit the datasource entity schema with externalType to the front-end when adding a new column", async () => {
      mysqlDatasource = (
        await makeRequest(
          "post",
          `/api/datasources/${mysqlDatasource._id}/schema`
        )
      ).body.datasource

      const addColumnToTable: TableRequest = {
        type: "table",
        sourceType: TableSourceType.EXTERNAL,
        name: "table",
        sourceId: mysqlDatasource._id!,
        primary: ["id"],
        schema: {
          id: {
            type: FieldType.AUTO,
            name: "id",
            autocolumn: true,
          },
          new_column: {
            type: FieldType.NUMBER,
            name: "new_column",
          },
        },
        _add: {
          name: "new_column",
        },
      }

      jest
        .spyOn(builderSocket!, "emitDatasourceUpdate")
        .mockImplementation(emitDatasourceUpdateMock)

      await makeRequest("post", "/api/tables/", addColumnToTable)

      const expectedTable: TableRequest = {
        ...addColumnToTable,
        schema: {
          id: {
            type: FieldType.NUMBER,
            name: "id",
            autocolumn: true,
            constraints: {
              presence: false,
            },
            externalType: "int unsigned",
          },
          new_column: {
            type: FieldType.NUMBER,
            name: "new_column",
            autocolumn: false,
            constraints: {
              presence: false,
            },
            externalType: "float(8,2)",
          },
        },
        created: true,
        _id: `${mysqlDatasource._id}__table`,
      }
      delete expectedTable._add

      expect(emitDatasourceUpdateMock).toBeCalledTimes(1)
      const emittedDatasource: Datasource =
        emitDatasourceUpdateMock.mock.calls[0][1]
      expect(emittedDatasource.entities!["table"]).toEqual(expectedTable)
    })
  })
})
