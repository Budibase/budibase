import fetch from "node-fetch"
import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"
import * as setup from "../api/routes/tests/utilities"
import {
  Datasource,
  FieldType,
  Table,
  TableRequest,
  TableSourceType,
} from "@budibase/types"
import {
  DatabaseName,
  getDatasource,
  rawQuery,
} from "../integrations/tests/utils"
import { generator } from "@budibase/backend-core/tests"
// @ts-ignore
fetch.mockSearch()

function uniqueTableName(length?: number): string {
  return generator
    .guid()
    .replaceAll("-", "_")
    .substring(0, length || 10)
}

const config = setup.getConfig()!

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
    rawDatasource: Datasource,
    datasource: Datasource,
    primaryMySqlTable: Table

  beforeAll(async () => {
    await config.init()
    const apiKey = await config.generateApiKey()

    makeRequest = generateMakeRequest(apiKey, true)

    rawDatasource = await getDatasource(DatabaseName.MYSQL)
    datasource = await config.api.datasource.create(rawDatasource)
  })

  beforeEach(async () => {
    primaryMySqlTable = await config.createTable({
      name: uniqueTableName(),
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
      },
      sourceId: datasource._id,
      sourceType: TableSourceType.EXTERNAL,
    })
  })

  afterAll(config.end)

  it("validate table schema", async () => {
    const res = await makeRequest("get", `/api/datasources/${datasource._id}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      config: {
        database: expect.any(String),
        host: datasource.config!.host,
        password: "--secret-value--",
        port: datasource.config!.port,
        user: "root",
      },
      plus: true,
      source: "MYSQL",
      type: "datasource_plus",
      isSQL: true,
      _id: expect.any(String),
      _rev: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      entities: expect.any(Object),
    })
  })

  describe("POST /api/datasources/verify", () => {
    it("should be able to verify the connection", async () => {
      await config.api.datasource.verify(
        {
          datasource: rawDatasource,
        },
        {
          body: {
            connected: true,
          },
        }
      )
    })

    it("should state an invalid datasource cannot connect", async () => {
      await config.api.datasource.verify(
        {
          datasource: {
            ...rawDatasource,
            config: {
              ...rawDatasource.config,
              password: "wrongpassword",
            },
          },
        },
        {
          body: {
            connected: false,
            error:
              "Access denied for the specified user. User does not have the necessary privileges or the provided credentials are incorrect. Please verify the credentials, and ensure that the user has appropriate permissions.",
          },
        }
      )
    })
  })

  describe("POST /api/datasources/info", () => {
    it("should fetch information about mysql datasource", async () => {
      const primaryName = primaryMySqlTable.name
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: datasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames.indexOf(primaryName)).not.toBe(-1)
    })
  })

  describe("Integration compatibility with mysql search_path", () => {
    let datasource: Datasource, rawDatasource: Datasource
    const database = generator.guid()
    const database2 = generator.guid()

    beforeAll(async () => {
      rawDatasource = await getDatasource(DatabaseName.MYSQL)

      await rawQuery(rawDatasource, `CREATE DATABASE \`${database}\`;`)
      await rawQuery(rawDatasource, `CREATE DATABASE \`${database2}\`;`)

      const pathConfig: any = {
        ...rawDatasource,
        config: {
          ...rawDatasource.config!,
          database,
        },
      }
      datasource = await config.api.datasource.create(pathConfig)
    })

    afterAll(async () => {
      await rawQuery(rawDatasource, `DROP DATABASE \`${database}\`;`)
      await rawQuery(rawDatasource, `DROP DATABASE \`${database2}\`;`)
    })

    it("discovers tables from any schema in search path", async () => {
      await rawQuery(
        rawDatasource,
        `CREATE TABLE \`${database}\`.table1 (id1 SERIAL PRIMARY KEY);`
      )
      const response = await makeRequest("post", "/api/datasources/info", {
        datasource: datasource,
      })
      expect(response.status).toBe(200)
      expect(response.body.tableNames).toBeDefined()
      expect(response.body.tableNames).toEqual(
        expect.arrayContaining(["table1"])
      )
    })

    it("does not mix columns from different tables", async () => {
      const repeated_table_name = "table_same_name"
      await rawQuery(
        rawDatasource,
        `CREATE TABLE \`${database}\`.${repeated_table_name} (id SERIAL PRIMARY KEY, val1 TEXT);`
      )
      await rawQuery(
        rawDatasource,
        `CREATE TABLE \`${database2}\`.${repeated_table_name} (id2 SERIAL PRIMARY KEY, val2 TEXT);`
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

  describe("POST /api/tables/", () => {
    it("will rename a column", async () => {
      await makeRequest("post", "/api/tables/", primaryMySqlTable)

      let renameColumnOnTable: TableRequest = {
        ...primaryMySqlTable,
        schema: {
          id: {
            name: "id",
            type: FieldType.AUTO,
            autocolumn: true,
            externalType: "unsigned integer",
          },
          name: {
            name: "name",
            type: FieldType.STRING,
            externalType: "text",
          },
          description: {
            name: "description",
            type: FieldType.STRING,
            externalType: "text",
          },
          age: {
            name: "age",
            type: FieldType.NUMBER,
            externalType: "float(8,2)",
          },
        },
      }

      const response = await makeRequest(
        "post",
        "/api/tables/",
        renameColumnOnTable
      )

      const ds = (
        await makeRequest("post", `/api/datasources/${datasource._id}/schema`)
      ).body.datasource

      expect(response.status).toEqual(200)
      expect(Object.keys(ds.entities![primaryMySqlTable.name].schema)).toEqual([
        "id",
        "name",
        "description",
        "age",
      ])
    })
  })

  describe("POST /api/datasources/:datasourceId/schema", () => {
    let tableName: string

    beforeEach(async () => {
      tableName = uniqueTableName()
    })

    afterEach(async () => {
      await rawQuery(rawDatasource, `DROP TABLE IF EXISTS \`${tableName}\``)
    })

    it("recognises enum columns as options", async () => {
      const enumColumnName = "status"

      const createTableQuery = `
        CREATE TABLE \`${tableName}\` (
          \`order_id\` INT AUTO_INCREMENT PRIMARY KEY,
          \`customer_name\` VARCHAR(100) NOT NULL,
          \`${enumColumnName}\` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')
        );
      `

      await rawQuery(rawDatasource, createTableQuery)

      const response = await makeRequest(
        "post",
        `/api/datasources/${datasource._id}/schema`
      )

      const table = response.body.datasource.entities[tableName]

      expect(table).toBeDefined()
      expect(table.schema[enumColumnName].type).toEqual(FieldType.OPTIONS)
    })
  })
})
