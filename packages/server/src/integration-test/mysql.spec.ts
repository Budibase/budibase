import fetch from "node-fetch"
import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"
import { v4 as uuidv4 } from "uuid"
import * as setup from "../api/routes/tests/utilities"
import {
  Datasource,
  FieldType,
  Table,
  TableRequest,
  TableSourceType,
} from "@budibase/types"
import { databaseTestProviders } from "../integrations/tests/utils"
import mysql from "mysql2/promise"
import { builderSocket } from "../websockets"
// @ts-ignore
fetch.mockSearch()

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
    mysqlDatasource: Datasource,
    primaryMySqlTable: Table

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
    primaryMySqlTable = await config.createTable({
      name: uuidv4(),
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
      sourceId: mysqlDatasource._id,
      sourceType: TableSourceType.EXTERNAL,
    })
  })

  afterAll(config.end)

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
          datasource: await databaseTestProviders.mysql.datasource(),
        },
        {
          body: {
            connected: true,
          },
        }
      )
    })

    it("should state an invalid datasource cannot connect", async () => {
      const dbConfig = await databaseTestProviders.mysql.datasource()
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
      mysqlDatasource = await config.api.datasource.create(
        await databaseTestProviders.mysql.datasource()
      )
    })

    afterEach(async () => {
      await client.end()
    })

    it("will emit the datasource entity schema with externalType to the front-end when adding a new column", async () => {
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

      expect(emitDatasourceUpdateMock).toHaveBeenCalledTimes(1)
      const emittedDatasource: Datasource =
        emitDatasourceUpdateMock.mock.calls[0][1]
      expect(emittedDatasource.entities!["table"]).toEqual(expectedTable)
    })

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
      mysqlDatasource = (
        await makeRequest(
          "post",
          `/api/datasources/${mysqlDatasource._id}/schema`
        )
      ).body.datasource

      expect(response.status).toEqual(200)
      expect(
        Object.keys(mysqlDatasource.entities![primaryMySqlTable.name].schema)
      ).toEqual(["id", "name", "description", "age"])
    })
  })
})
