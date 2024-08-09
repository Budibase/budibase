import * as setup from "./utilities"
import { checkBuilderEndpoint, allowUndefined } from "./utilities/TestFunctions"
import { getCachedVariable } from "../../../threads/utils"
import { context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"

import { generator } from "@budibase/backend-core/tests"
import {
  Datasource,
  FieldSchema,
  BBReferenceFieldSubType,
  FieldType,
  RelationshipType,
  SourceName,
  Table,
  TableSchema,
  SupportedSqlTypes,
  JsonFieldSubType,
} from "@budibase/types"
import {
  DatabaseName,
  getDatasource,
  knexClient,
} from "../../../integrations/tests/utils"
import { tableForDatasource } from "../../../tests/utilities/structures"
import nock from "nock"
import { Knex } from "knex"

describe("/datasources", () => {
  const config = setup.getConfig()
  let datasource: Datasource

  beforeAll(async () => {
    await config.init()
  })
  afterAll(setup.afterAll)

  beforeEach(async () => {
    datasource = await config.api.datasource.create({
      type: "datasource",
      name: "Test",
      source: SourceName.POSTGRES,
      config: {},
    })
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe("create", () => {
    it("should create a new datasource", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Test",
        source: SourceName.POSTGRES,
        config: {},
      })
      expect(ds.name).toEqual("Test")
      expect(events.datasource.created).toHaveBeenCalledTimes(1)
    })

    it("should fail if the datasource is invalid", async () => {
      await config.api.datasource.create(
        {
          name: "Test",
          type: "test",
          source: "invalid" as SourceName,
          config: {},
        },
        {
          status: 500,
          body: {
            message: "No datasource implementation found.",
          },
        }
      )
    })
  })

  describe("dynamic variables", () => {
    it("should invalidate changed or removed variables", async () => {
      nock("http://www.example.com/")
        .get("/")
        .reply(200, [{ value: "test" }])
        .get("/?test=test")
        .reply(200, [{ value: 1 }])

      let datasource = await config.api.datasource.create({
        type: "datasource",
        name: "Rest",
        source: SourceName.REST,
        config: {},
      })

      const query = await config.api.query.save({
        datasourceId: datasource._id!,
        fields: {
          path: "www.example.com",
        },
        parameters: [],
        transformer: null,
        queryVerb: "read",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      datasource = await config.api.datasource.update({
        ...datasource,
        config: {
          dynamicVariables: [
            {
              queryId: query._id,
              name: "variable3",
              value: "{{ data.0.[value] }}",
            },
          ],
        },
      })

      // preview once to cache variables
      await config.api.query.preview({
        fields: {
          path: "www.example.com",
          queryString: "test={{ variable3 }}",
        },
        datasourceId: datasource._id!,
        parameters: [],
        transformer: null,
        queryVerb: "read",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      // check variables in cache
      let contents = await getCachedVariable(query._id!, "variable3")
      expect(contents.rows.length).toEqual(1)

      // update the datasource to remove the variables
      datasource.config!.dynamicVariables = []
      await config.api.datasource.update(datasource)

      // check variables no longer in cache
      contents = await getCachedVariable(query._id!, "variable3")
      expect(contents).toBe(null)
    })
  })

  describe("permissions", () => {
    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/datasources`,
      })
    })

    it("should apply authorization to delete endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })
  })

  describe.each([
    [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
    [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
    [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
    [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
    [DatabaseName.ORACLE, getDatasource(DatabaseName.ORACLE)],
  ])("%s", (_, dsProvider) => {
    let rawDatasource: Datasource
    let client: Knex

    beforeEach(async () => {
      rawDatasource = await dsProvider
      datasource = await config.api.datasource.create(rawDatasource)
      client = await knexClient(rawDatasource)
    })

    describe("get", () => {
      it("should be able to get a datasource", async () => {
        const ds = await config.api.datasource.get(datasource._id!)
        expect(ds).toEqual({
          config: expect.any(Object),
          plus: datasource.plus,
          source: datasource.source,
          isSQL: true,
          type: "datasource_plus",
          _id: datasource._id,
          _rev: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })

      it("should not return database password", async () => {
        const ds = await config.api.datasource.get(datasource._id!)
        expect(ds.config!.password).toBe("--secret-value--")
      })
    })

    describe("list", () => {
      it("returns all the datasources", async () => {
        const datasources = await config.api.datasource.fetch()
        expect(datasources).toContainEqual(expect.objectContaining(datasource))
      })
    })

    describe("put", () => {
      it("should update an existing datasource", async () => {
        const newName = generator.guid()
        datasource.name = newName
        const updatedDs = await config.api.datasource.update(datasource)
        expect(updatedDs.name).toEqual(newName)
        expect(events.datasource.updated).toHaveBeenCalledTimes(1)
      })

      it("should not overwrite database password with --secret-value--", async () => {
        const password = await context.doInAppContext(
          config.getAppId(),
          async () => {
            const ds = await sdk.datasources.get(datasource._id!)
            return ds.config!.password
          }
        )

        expect(password).not.toBe("--secret-value--")

        const ds = await config.api.datasource.get(datasource._id!)
        expect(ds.config!.password).toBe("--secret-value--")

        await config.api.datasource.update(
          await config.api.datasource.get(datasource._id!)
        )

        const newPassword = await context.doInAppContext(
          config.getAppId(),
          async () => {
            const ds = await sdk.datasources.get(datasource._id!)
            return ds.config!.password
          }
        )

        expect(newPassword).not.toBe("--secret-value--")
        expect(newPassword).toBe(password)
      })
    })

    describe("destroy", () => {
      it("deletes queries for the datasource after deletion and returns a success message", async () => {
        await config.api.query.save({
          datasourceId: datasource._id!,
          name: "Test Query",
          parameters: [],
          fields: {},
          schema: {},
          queryVerb: "read",
          transformer: null,
          readable: true,
        })

        await config.api.datasource.delete(datasource)
        const datasources = await config.api.datasource.fetch()
        expect(datasources).not.toContainEqual(
          expect.objectContaining(datasource)
        )
        expect(events.datasource.deleted).toHaveBeenCalledTimes(1)
      })
    })

    describe("schema", () => {
      it("fetching schema will not drop tables or columns", async () => {
        const datasourceId = datasource!._id!

        const simpleTable = await config.api.table.save(
          tableForDatasource(datasource, {
            name: "simple",
            schema: {
              name: {
                name: "name",
                type: FieldType.STRING,
              },
            },
          })
        )

        const stringName = "string"
        const fullSchema: {
          [type in SupportedSqlTypes]: FieldSchema & { type: type }
        } = {
          [FieldType.STRING]: {
            name: stringName,
            type: FieldType.STRING,
          },
          [FieldType.LONGFORM]: {
            name: "longform",
            type: FieldType.LONGFORM,
          },
          [FieldType.OPTIONS]: {
            name: "options",
            type: FieldType.OPTIONS,
            constraints: {
              presence: {
                allowEmpty: false,
              },
              inclusion: [],
            },
          },
          [FieldType.NUMBER]: {
            name: "number",
            type: FieldType.NUMBER,
          },
          [FieldType.BOOLEAN]: {
            name: "boolean",
            type: FieldType.BOOLEAN,
          },
          [FieldType.ARRAY]: {
            name: "array",
            type: FieldType.ARRAY,
            constraints: {
              type: JsonFieldSubType.ARRAY,
              inclusion: [],
            },
          },
          [FieldType.DATETIME]: {
            name: "datetime",
            type: FieldType.DATETIME,
            dateOnly: true,
            timeOnly: false,
          },
          [FieldType.LINK]: {
            name: "link",
            type: FieldType.LINK,
            tableId: simpleTable._id!,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "link",
          },
          [FieldType.FORMULA]: {
            name: "formula",
            type: FieldType.FORMULA,
            formula: "any formula",
          },
          [FieldType.BARCODEQR]: {
            name: "barcodeqr",
            type: FieldType.BARCODEQR,
          },
          [FieldType.BIGINT]: {
            name: "bigint",
            type: FieldType.BIGINT,
          },
          [FieldType.BB_REFERENCE]: {
            name: "bb_reference",
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USER,
          },
          [FieldType.BB_REFERENCE_SINGLE]: {
            name: "bb_reference_single",
            type: FieldType.BB_REFERENCE_SINGLE,
            subtype: BBReferenceFieldSubType.USER,
          },
        }

        await config.api.table.save(
          tableForDatasource(datasource, {
            name: "full",
            schema: fullSchema,
          })
        )

        const persisted = await config.api.datasource.get(datasourceId)
        await config.api.datasource.fetchSchema({ datasourceId })

        const updated = await config.api.datasource.get(datasourceId)
        const expected: Datasource = {
          ...persisted,
          entities:
            persisted?.entities &&
            Object.entries(persisted.entities).reduce<Record<string, Table>>(
              (acc, [tableName, table]) => {
                acc[tableName] = expect.objectContaining({
                  ...table,
                  primaryDisplay: expect.not.stringMatching(
                    new RegExp(`^${table.primaryDisplay || ""}$`)
                  ),
                  schema: Object.entries(table.schema).reduce<TableSchema>(
                    (acc, [fieldName, field]) => {
                      acc[fieldName] = {
                        ...field,
                        externalType: allowUndefined(expect.any(String)),
                        constraints: allowUndefined(expect.any(Object)),
                        autocolumn: allowUndefined(expect.any(Boolean)),
                      }
                      return acc
                    },
                    {}
                  ),
                })
                return acc
              },
              {}
            ),

          _rev: expect.any(String),
          updatedAt: expect.any(String),
        }
        expect(updated).toEqual(expected)
      })
    })

    describe("verify", () => {
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
              error: /.*/, // error message differs between databases
            },
          }
        )
      })
    })

    describe("info", () => {
      it("should fetch information about a datasource with a single table", async () => {
        const existingTableNames = (
          await config.api.datasource.info(datasource)
        ).tableNames

        const tableName = generator.guid()
        await client.schema.createTable(tableName, table => {
          table.increments("id").primary()
          table.string("name")
        })

        const info = await config.api.datasource.info(datasource)
        expect(info.tableNames).toEqual(
          expect.arrayContaining([tableName, ...existingTableNames])
        )
        expect(info.tableNames).toHaveLength(existingTableNames.length + 1)
      })

      it("should fetch information about a datasource with multiple tables", async () => {
        const existingTableNames = (
          await config.api.datasource.info(datasource)
        ).tableNames

        const tableNames = [
          generator.guid(),
          generator.guid(),
          generator.guid(),
          generator.guid(),
        ]
        for (const tableName of tableNames) {
          await client.schema.createTable(tableName, table => {
            table.increments("id").primary()
            table.string("name")
          })
        }

        const info = await config.api.datasource.info(datasource)
        expect(info.tableNames).toEqual(
          expect.arrayContaining([...tableNames, ...existingTableNames])
        )
        expect(info.tableNames).toHaveLength(
          existingTableNames.length + tableNames.length
        )
      })
    })
  })
})
