import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import { getCachedVariable } from "../../../threads/utils"
import { context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"

import tk from "timekeeper"
import { mocks } from "@budibase/backend-core/tests"
import {
  Datasource,
  FieldSchema,
  BBReferenceFieldSubType,
  FieldType,
  QueryPreview,
  RelationshipType,
  SourceName,
  Table,
  TableSchema,
  SupportedSqlTypes,
} from "@budibase/types"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"
import { tableForDatasource } from "../../../tests/utilities/structures"

tk.freeze(mocks.date.MOCK_DATE)

let { basicDatasource } = setup.structures

describe("/datasources", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource: any

  afterAll(setup.afterAll)

  async function setupTest() {
    await config.init()
    datasource = await config.createDatasource()
    jest.clearAllMocks()
  }

  beforeAll(setupTest)

  describe("create", () => {
    it("should create a new datasource", async () => {
      const res = await request
        .post(`/api/datasources`)
        .send(basicDatasource())
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.datasource.name).toEqual("Test")
      expect(res.body.errors).toEqual({})
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

  describe("update", () => {
    it("should update an existing datasource", async () => {
      datasource.name = "Updated Test"
      const res = await request
        .put(`/api/datasources/${datasource._id}`)
        .send(datasource)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.datasource.name).toEqual("Updated Test")
      expect(res.body.errors).toBeUndefined()
      expect(events.datasource.updated).toHaveBeenCalledTimes(1)
    })

    describe("dynamic variables", () => {
      async function preview(
        datasource: any,
        fields: { path: string; queryString: string }
      ) {
        const queryPreview: QueryPreview = {
          fields,
          datasourceId: datasource._id,
          parameters: [],
          transformer: null,
          queryVerb: "read",
          name: datasource.name,
          schema: {},
          readable: true,
        }
        return config.api.query.preview(queryPreview)
      }

      it("should invalidate changed or removed variables", async () => {
        const { datasource, query } = await config.dynamicVariableDatasource()
        // preview once to cache variables
        await preview(datasource, {
          path: "www.example.com",
          queryString: "test={{ variable3 }}",
        })
        // check variables in cache
        let contents = await getCachedVariable(query._id!, "variable3")
        expect(contents.rows.length).toEqual(1)

        // update the datasource to remove the variables
        datasource.config!.dynamicVariables = []
        const res = await request
          .put(`/api/datasources/${datasource._id}`)
          .send(datasource)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body.errors).toBeUndefined()

        // check variables no longer in cache
        contents = await getCachedVariable(query._id!, "variable3")
        expect(contents).toBe(null)
      })
    })
  })

  describe("fetch", () => {
    beforeAll(setupTest)

    it("returns all the datasources from the server", async () => {
      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      const datasources = res.body

      // remove non-deterministic fields
      for (let source of datasources) {
        delete source._id
        delete source._rev
      }

      expect(datasources).toMatchSnapshot()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/datasources`,
      })
    })
  })

  describe("find", () => {
    it("should be able to find a datasource", async () => {
      const res = await request
        .get(`/api/datasources/${datasource._id}`)
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(res.body._id).toEqual(datasource._id)
    })
  })

  describe("destroy", () => {
    beforeAll(setupTest)

    it("deletes queries for the datasource after deletion and returns a success message", async () => {
      await config.createQuery()

      await request
        .delete(`/api/datasources/${datasource._id}/${datasource._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toEqual(1)
      expect(events.datasource.deleted).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })
  })

  describe("check secret replacement", () => {
    async function makeDatasource() {
      datasource = basicDatasource()
      datasource.datasource.config.password = "testing"
      const res = await request
        .post(`/api/datasources`)
        .send(datasource)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      return res.body.datasource
    }

    it("should save a datasource with password", async () => {
      const datasource = await makeDatasource()
      expect(datasource.config.password).toBe("--secret-value--")
    })

    it("should not the password on update with the --secret-value--", async () => {
      const datasource = await makeDatasource()
      await request
        .put(`/api/datasources/${datasource._id}`)
        .send(datasource)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      await context.doInAppContext(config.getAppId(), async () => {
        const dbDatasource: any = await sdk.datasources.get(datasource._id)
        expect(dbDatasource.config.password).toBe("testing")
      })
    })
  })

  describe.each([
    [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
    [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
    [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
    [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
  ])("fetch schema (%s)", (_, dsProvider) => {
    beforeAll(async () => {
      datasource = await config.api.datasource.create(await dsProvider)
    })

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

      const fullSchema: {
        [type in SupportedSqlTypes]: FieldSchema & { type: type }
      } = {
        [FieldType.STRING]: {
          name: "string",
          type: FieldType.STRING,
          constraints: {
            presence: true,
          },
        },
        [FieldType.LONGFORM]: {
          name: "longform",
          type: FieldType.LONGFORM,
        },
        [FieldType.OPTIONS]: {
          name: "options",
          type: FieldType.OPTIONS,
          constraints: {
            presence: { allowEmpty: false },
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
      await config.api.datasource.fetchSchema(datasourceId)

      const updated = await config.api.datasource.get(datasourceId)
      const expected: Datasource = {
        ...persisted,
        entities:
          persisted?.entities &&
          Object.entries(persisted.entities).reduce<Record<string, Table>>(
            (acc, [tableName, table]) => {
              acc[tableName] = {
                ...table,
                primaryDisplay: expect.not.stringMatching(
                  new RegExp(`^${table.primaryDisplay || ""}$`)
                ),
                schema: Object.entries(table.schema).reduce<TableSchema>(
                  (acc, [fieldName, field]) => {
                    acc[fieldName] = expect.objectContaining({
                      ...field,
                    })
                    return acc
                  },
                  {}
                ),
              }
              return acc
            },
            {}
          ),

        _rev: expect.any(String),
      }
      expect(updated).toEqual(expected)
    })
  })
})
