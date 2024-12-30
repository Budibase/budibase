import { context, docIds, events } from "@budibase/backend-core"
import {
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import {
  AutoFieldSubType,
  BBReferenceFieldSubType,
  Datasource,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  RelationshipType,
  Row,
  SaveTableRequest,
  Table,
  TableSchema,
  TableSourceType,
  User,
  ValidateTableImportResponse,
  ViewCalculation,
  ViewV2Enriched,
  RowExportFormat,
  PermissionLevel,
} from "@budibase/types"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import * as setup from "./utilities"
import * as uuid from "uuid"

import { generator } from "@budibase/backend-core/tests"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { tableForDatasource } from "../../../tests/utilities/structures"
import timekeeper from "timekeeper"

const { basicTable } = setup.structures
const ISO_REGEX_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

const descriptions = datasourceDescribe({ exclude: [DatabaseName.MONGODB] })

if (descriptions.length) {
  describe.each(descriptions)(
    "/tables ($dbName)",
    ({ config, dsProvider, isInternal, isOracle }) => {
      let datasource: Datasource | undefined

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource
      })

      describe("create", () => {
        beforeEach(() => {
          jest.clearAllMocks()
        })

        let names = [
          "alphanum",
          "with spaces",
          "with-dashes",
          "with_underscores",
          "with `backticks`",
        ]

        if (!isOracle) {
          names.push(`with "double quotes"`)
          names.push(`with 'single quotes'`)
        }

        it.each(names)("creates a table with name: %s", async name => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, { name })
          )
          expect(table.name).toEqual(name)
          expect(events.table.created).toHaveBeenCalledTimes(1)
          expect(events.table.created).toHaveBeenCalledWith(table)

          const res = await config.api.table.get(table._id!)
          expect(res.name).toEqual(name)
        })

        it("creates a table via data import", async () => {
          const table: SaveTableRequest = basicTable()
          table.rows = [{ name: "test-name", description: "test-desc" }]

          const res = await config.api.table.save(table)

          expect(events.table.created).toHaveBeenCalledTimes(1)
          expect(events.table.created).toHaveBeenCalledWith(res)
          expect(events.table.imported).toHaveBeenCalledTimes(1)
          expect(events.table.imported).toHaveBeenCalledWith(res)
          expect(events.rows.imported).toHaveBeenCalledTimes(1)
          expect(events.rows.imported).toHaveBeenCalledWith(res, 1)
        })

        it("should not allow a column to have a default value and be required", async () => {
          await config.api.table.save(
            tableForDatasource(datasource, {
              schema: {
                name: {
                  name: "name",
                  type: FieldType.STRING,
                  default: "default",
                  constraints: {
                    presence: true,
                  },
                },
              },
            }),
            {
              status: 400,
              body: {
                message:
                  'Cannot make field "name" required, it has a default value.',
              },
            }
          )
        })

        it("should apply authorization to endpoint", async () => {
          await checkBuilderEndpoint({
            config,
            method: "POST",
            url: `/api/tables`,
            body: basicTable(),
          })
        })

        it("does not persist the row fields that are not on the table schema", async () => {
          const table: SaveTableRequest = basicTable()
          table.rows = [
            {
              name: "test-name",
              description: "test-desc",
              nonValid: "test-non-valid",
            },
          ]

          const res = await config.api.table.save(table)

          const persistedRows = await config.api.row.search(res._id!)

          expect(persistedRows.rows).toEqual([
            expect.objectContaining({
              name: "test-name",
              description: "test-desc",
            }),
          ])
          expect(persistedRows.rows[0].nonValid).toBeUndefined()
        })

        it.each(
          isInternal ? PROTECTED_INTERNAL_COLUMNS : PROTECTED_EXTERNAL_COLUMNS
        )(
          "cannot use protected column names (%s) while importing a table",
          async columnName => {
            const table: SaveTableRequest = basicTable()
            table.rows = [
              {
                name: "test-name",
                description: "test-desc",
              },
            ]

            await config.api.table.save(
              {
                ...table,
                schema: {
                  ...table.schema,
                  [columnName]: {
                    name: columnName,
                    type: FieldType.STRING,
                  },
                },
              },
              {
                status: 400,
                body: {
                  message: `Column(s) "${columnName}" are duplicated - check for other columns with these name (case in-sensitive)`,
                  status: 400,
                },
              }
            )
          }
        )

        it("can set primary display", async () => {
          const columnName = generator.word()
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
              primaryDisplay: columnName,
              schema: {
                [columnName]: {
                  name: columnName,
                  type: FieldType.STRING,
                },
              },
            })
          )
          expect(table.primaryDisplay).toEqual(columnName)

          const res = await config.api.table.get(table._id!)
          expect(res.primaryDisplay).toEqual(columnName)
        })

        it("cannot use unexisting columns as primary display", async () => {
          const columnName = generator.word()
          await config.api.table.save(
            tableForDatasource(datasource, {
              primaryDisplay: columnName,
            }),
            {
              status: 400,
              body: {
                message: `Column "${columnName}" cannot be used as a display type.`,
              },
            }
          )
        })

        it("cannot use invalid column types as display name", async () => {
          const columnName = generator.word()

          await config.api.table.save(
            tableForDatasource(datasource, {
              primaryDisplay: columnName,
              schema: {
                [columnName]: {
                  name: columnName,
                  type: FieldType.BOOLEAN,
                },
              },
            }),
            {
              status: 400,
              body: {
                message: `Column "${columnName}" cannot be used as a display type.`,
              },
            }
          )
        })
      })

      describe("permissions", () => {
        it("get the base permissions for the table", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
              schema: {
                name: {
                  type: FieldType.STRING,
                  name: "name",
                },
              },
            })
          )

          // get the explicit permissions
          const { permissions } = await config.api.permission.get(table._id!, {
            status: 200,
          })
          const explicitPermissions = {
            role: "ADMIN",
            permissionType: "EXPLICIT",
          }
          expect(permissions.write).toEqual(explicitPermissions)
          expect(permissions.read).toEqual(explicitPermissions)

          // revoke the explicit permissions
          for (let level of [PermissionLevel.WRITE, PermissionLevel.READ]) {
            await config.api.permission.revoke(
              {
                roleId: permissions[level].role,
                resourceId: table._id!,
                level,
              },
              { status: 200 }
            )
          }

          // check base permissions
          const { permissions: basePermissions } =
            await config.api.permission.get(table._id!, {
              status: 200,
            })
          const basePerms = { role: "BASIC", permissionType: "BASE" }
          expect(basePermissions.write).toEqual(basePerms)
          expect(basePermissions.read).toEqual(basePerms)
        })
      })

      describe("update", () => {
        it("updates a table", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource, {
              schema: {
                name: {
                  type: FieldType.STRING,
                  name: "name",
                  constraints: {
                    type: "string",
                  },
                },
              },
              primary: ["_id"],
              views: {},
              sql: true,
            })
          )

          const updatedTable = await config.api.table.save({
            ...table,
            name: generator.guid(),
          })
          expect(events.table.updated).toHaveBeenCalledTimes(1)
          expect(events.table.updated).toHaveBeenCalledWith(table, updatedTable)
        })

        it("updates all the row fields for a table when a schema key is renamed", async () => {
          const testTable = await config.api.table.save(basicTable(datasource))
          await config.createLegacyView({
            name: "TestView",
            field: "Price",
            calculation: ViewCalculation.STATISTICS,
            tableId: testTable._id!,
            schema: {},
            filters: [],
          })

          const testRow = await config.api.row.save(testTable._id!, {
            name: "test",
          })

          const { name, ...otherColumns } = testTable.schema
          const updatedTable = await config.api.table.save({
            ...testTable,
            _rename: {
              old: "name",
              updated: "updatedName",
            },
            schema: {
              ...otherColumns,
              updatedName: {
                ...name,
                name: "updatedName",
              },
            },
          })

          expect(updatedTable.name).toEqual(testTable.name)

          const res = await config.api.row.get(testTable._id!, testRow._id!)
          expect(res.updatedName).toEqual("test")
          expect(res.name).toBeUndefined()
        })

        isInternal &&
          it("updates only the passed fields", async () => {
            await timekeeper.withFreeze(new Date(2021, 1, 1), async () => {
              const table = await config.api.table.save(
                tableForDatasource(datasource, {
                  schema: {
                    autoId: {
                      name: "id",
                      type: FieldType.NUMBER,
                      subtype: AutoFieldSubType.AUTO_ID,
                      autocolumn: true,
                      constraints: {
                        type: "number",
                        presence: false,
                      },
                    },
                  },
                })
              )

              const newName = generator.guid()

              const updatedTable = await config.api.table.save({
                ...table,
                name: newName,
              })

              let expected: Table = {
                ...table,
                name: newName,
                _id: expect.any(String),
              }
              if (isInternal) {
                expected._rev = expect.stringMatching(/^2-.+/)
              }

              expect(updatedTable).toEqual(expect.objectContaining(expected))

              const persistedTable = await config.api.table.get(
                updatedTable._id!
              )
              expected = {
                ...table,
                name: newName,
                _id: updatedTable._id,
              }
              if (datasource?.isSQL) {
                expected.sql = true
              }
              if (isInternal) {
                expected._rev = expect.stringMatching(/^2-.+/)
              }
              expect(persistedTable).toEqual(expect.objectContaining(expected))
            })
          })

        describe("user table", () => {
          isInternal &&
            it("should add roleId and email field when adjusting user table schema", async () => {
              const table = await config.api.table.save({
                ...basicTable(datasource),
                _id: "ta_users",
              })
              expect(table.schema.email).toBeDefined()
              expect(table.schema.roleId).toBeDefined()
            })
        })

        describe("default field validation", () => {
          it("should error if an existing column is set to required and has a default value", async () => {
            const table = await config.api.table.save(
              tableForDatasource(datasource, {
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    default: "default",
                  },
                },
              })
            )

            await config.api.table.save(
              {
                ...table,
                schema: {
                  ...table.schema,
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    default: "default",
                    constraints: {
                      presence: true,
                    },
                  },
                },
              },
              {
                status: 400,
                body: {
                  message:
                    'Cannot make field "name" required, it has a default value.',
                },
              }
            )
          })

          it("should error if an existing column is given a default value and is required", async () => {
            const table = await config.api.table.save(
              tableForDatasource(datasource, {
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    constraints: {
                      presence: true,
                    },
                  },
                },
              })
            )

            await config.api.table.save(
              {
                ...table,
                schema: {
                  ...table.schema,
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    default: "default",
                    constraints: {
                      presence: true,
                    },
                  },
                },
              },
              {
                status: 400,
                body: {
                  message:
                    'Cannot make field "name" required, it has a default value.',
                },
              }
            )
          })

          it("should be able to set an existing column to have a default value if it's not required", async () => {
            const table = await config.api.table.save(
              tableForDatasource(datasource, {
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                  },
                },
              })
            )

            await config.api.table.save(
              {
                ...table,
                schema: {
                  ...table.schema,
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    default: "default",
                  },
                },
              },
              { status: 200 }
            )
          })

          it("should be able to remove a default value if the column is not required", async () => {
            const table = await config.api.table.save(
              tableForDatasource(datasource, {
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    default: "default",
                  },
                },
              })
            )

            await config.api.table.save(
              {
                ...table,
                schema: {
                  ...table.schema,
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                  },
                },
              },
              { status: 200 }
            )
          })
        })

        describe("external table validation", () => {
          !isInternal &&
            it("should error if column is of type auto", async () => {
              const table = basicTable(datasource)
              await config.api.table.save(
                {
                  ...table,
                  schema: {
                    ...table.schema,
                    auto: {
                      name: "auto",
                      autocolumn: true,
                      type: FieldType.AUTO,
                      subtype: AutoFieldSubType.AUTO_ID,
                    },
                  },
                },
                {
                  status: 400,
                  body: {
                    message: `Column "auto" has type "${FieldType.AUTO}" - this is not supported.`,
                  },
                }
              )
            })

          !isInternal &&
            it("should error if column has auto subtype", async () => {
              const table = basicTable(datasource)
              await config.api.table.save(
                {
                  ...table,
                  schema: {
                    ...table.schema,
                    auto: {
                      name: "auto",
                      autocolumn: true,
                      type: FieldType.NUMBER,
                      subtype: AutoFieldSubType.AUTO_ID,
                    },
                  },
                },
                {
                  status: 400,
                  body: {
                    message: `Column "auto" has subtype "${AutoFieldSubType.AUTO_ID}" - this is not supported.`,
                  },
                }
              )
            })
        })

        isInternal &&
          it("shouldn't allow duplicate column names", async () => {
            const saveTableRequest: SaveTableRequest = {
              ...basicTable(),
            }
            saveTableRequest.schema["Type"] = {
              type: FieldType.STRING,
              name: "Type",
            }
            // allow the "Type" column - internal columns aren't case sensitive
            await config.api.table.save(saveTableRequest, {
              status: 200,
            })
            saveTableRequest.schema.foo = {
              type: FieldType.STRING,
              name: "foo",
            }
            saveTableRequest.schema.FOO = {
              type: FieldType.STRING,
              name: "FOO",
            }

            await config.api.table.save(saveTableRequest, {
              status: 400,
              body: {
                message:
                  'Column(s) "foo" are duplicated - check for other columns with these name (case in-sensitive)',
              },
            })
          })

        it("should add a new column for an internal DB table", async () => {
          const saveTableRequest: SaveTableRequest = {
            ...basicTable(),
          }

          const response = await config.api.table.save(saveTableRequest)

          const expectedResponse = {
            ...saveTableRequest,
            _rev: expect.stringMatching(/^\d-.+/),
            _id: expect.stringMatching(/^ta_.+/),
            createdAt: expect.stringMatching(ISO_REGEX_PATTERN),
            updatedAt: expect.stringMatching(ISO_REGEX_PATTERN),
            views: {},
          }
          expect(response).toEqual(expectedResponse)
        })

        it("cannot use unexisting columns as primary display", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource)
          )

          const columnName = generator.word()
          const tableRequest = {
            ...table,
            primaryDisplay: columnName,
          }
          await config.api.table.save(tableRequest, {
            status: 400,
            body: {
              message: `Column "${columnName}" cannot be used as a display type.`,
            },
          })
        })

        it("cannot use invalid column types as display name", async () => {
          const table = await config.api.table.save(
            tableForDatasource(datasource)
          )
          const columnName = generator.word()
          const tableRequest: SaveTableRequest = {
            ...table,
            primaryDisplay: columnName,
            schema: {
              ...table.schema,
              [columnName]: {
                name: columnName,
                type: FieldType.BOOLEAN,
              },
            },
          }

          await config.api.table.save(tableRequest, {
            status: 400,
            body: {
              message: `Column "${columnName}" cannot be used as a display type.`,
            },
          })
        })
      })

      describe("import", () => {
        it("imports rows successfully", async () => {
          const name = generator.guid()
          const table = await config.api.table.save(
            basicTable(datasource, { name })
          )
          const importRequest = {
            schema: table.schema,
            rows: [{ name: "test-name", description: "test-desc" }],
          }

          jest.clearAllMocks()

          await config.api.table.import(table._id!, importRequest)

          expect(events.table.created).not.toHaveBeenCalled()
          expect(events.rows.imported).toHaveBeenCalledTimes(1)
          expect(events.rows.imported).toHaveBeenCalledWith(
            expect.objectContaining({
              name,
              _id: table._id,
            }),
            1
          )
        })
      })

      describe("fetch", () => {
        let testTable: Table

        beforeEach(async () => {
          testTable = await config.api.table.save(
            basicTable(datasource, { name: generator.guid() })
          )
        })

        it("returns all tables", async () => {
          const res = await config.api.table.fetch()
          const table = res.find(t => t._id === testTable._id)
          expect(table).toBeDefined()
          expect(table!.name).toEqual(testTable.name)
          expect(table!.type).toEqual("table")
          expect(table!.sourceType).toEqual(testTable.sourceType)
        })

        it("should apply authorization to endpoint", async () => {
          await checkBuilderEndpoint({
            config,
            method: "GET",
            url: `/api/tables`,
          })
        })

        it("should enrich the view schemas", async () => {
          const viewV2 = await config.api.viewV2.create({
            tableId: testTable._id!,
            name: generator.guid(),
          })
          const legacyView = await config.api.legacyView.save({
            tableId: testTable._id!,
            name: generator.guid(),
            filters: [],
            schema: {},
          })

          const res = await config.api.table.fetch()

          const table = res.find(t => t._id === testTable._id)
          expect(table).toBeDefined()
          expect(table!.views![viewV2.name]).toBeDefined()

          const expectedViewV2: ViewV2Enriched = {
            ...viewV2,
            schema: {
              description: {
                constraints: {
                  type: "string",
                },
                name: "description",
                type: FieldType.STRING,
                visible: false,
              },
              name: {
                constraints: {
                  type: "string",
                },
                name: "name",
                type: FieldType.STRING,
                visible: false,
              },
            },
          }

          if (!isInternal) {
            expectedViewV2.schema!.id = {
              name: "id",
              type: FieldType.NUMBER,
              visible: false,
              autocolumn: true,
            }
          }

          expect(table!.views![viewV2.name!]).toEqual(expectedViewV2)

          if (isInternal) {
            expect(table!.views![legacyView.name!]).toBeDefined()
            expect(table!.views![legacyView.name!]).toEqual({
              ...legacyView,
              schema: {
                description: {
                  constraints: {
                    type: "string",
                  },
                  name: "description",
                  type: "string",
                },
                name: {
                  constraints: {
                    type: "string",
                  },
                  name: "name",
                  type: "string",
                },
              },
            })
          }
        })
      })

      describe("get", () => {
        it("returns a table", async () => {
          const table = await config.api.table.save(
            basicTable(datasource, { name: generator.guid() })
          )
          const res = await config.api.table.get(table._id!)
          expect(res).toEqual(expect.objectContaining(table))
        })
      })

      describe("indexing", () => {
        it("should be able to create a table with indexes", async () => {
          await context.doInAppContext(config.getAppId(), async () => {
            const db = context.getAppDB()
            const indexCount = (await db.getIndexes()).total_rows
            const table = basicTable()
            table.indexes = ["name"]
            const res = await config.api.table.save(table)
            expect(res._id).toBeDefined()
            expect(res._rev).toBeDefined()
            expect((await db.getIndexes()).total_rows).toEqual(indexCount + 1)
            // update index to see what happens
            table.indexes = ["name", "description"]
            await config.api.table.save({
              ...table,
              _id: res._id,
              _rev: res._rev,
            })
            // shouldn't have created a new index
            expect((await db.getIndexes()).total_rows).toEqual(indexCount + 1)
          })
        })
      })

      describe("destroy", () => {
        let testTable: Table

        beforeEach(async () => {
          testTable = await config.createTable()
        })

        it("returns a success response when a table is deleted.", async () => {
          await config.api.table.destroy(testTable._id!, testTable._rev!, {
            body: { message: `Table ${testTable._id} deleted.` },
          })
          expect(events.table.deleted).toHaveBeenCalledTimes(1)
          expect(events.table.deleted).toHaveBeenCalledWith(
            expect.objectContaining({
              ...testTable,
              tableId: testTable._id,
            })
          )
        })

        it("deletes linked references to the table after deletion", async () => {
          const linkedTable = await config.createTable({
            name: "LinkedTable",
            type: "table",
            schema: {
              name: {
                type: FieldType.STRING,
                name: "name",
                constraints: {
                  type: "string",
                },
              },
              TestTable: {
                type: FieldType.LINK,
                relationshipType: RelationshipType.ONE_TO_MANY,
                name: "TestTable",
                fieldName: "TestTable",
                tableId: testTable._id!,
                constraints: {
                  type: "array",
                },
              },
            },
          })

          await config.api.table.destroy(testTable._id!, testTable._rev!, {
            body: { message: `Table ${testTable._id} deleted.` },
          })
          const dependentTable = await config.api.table.get(linkedTable._id!)
          expect(dependentTable.schema.TestTable).not.toBeDefined()
        })

        it("should apply authorization to endpoint", async () => {
          await checkBuilderEndpoint({
            config,
            method: "DELETE",
            url: `/api/tables/${testTable._id}/${testTable._rev}`,
          })
        })
      })

      describe("migrate", () => {
        let users: User[]
        beforeAll(async () => {
          users = await Promise.all([
            config.createUser({ email: `${uuid.v4()}@example.com` }),
            config.createUser({ email: `${uuid.v4()}@example.com` }),
            config.createUser({ email: `${uuid.v4()}@example.com` }),
          ])
        })

        it("should successfully migrate a one-to-many user relationship to a user column", async () => {
          const table = await config.api.table.save({
            name: "table",
            type: "table",
            sourceId: INTERNAL_TABLE_SOURCE_ID,
            sourceType: TableSourceType.INTERNAL,
            schema: {
              "user relationship": {
                type: FieldType.LINK,
                fieldName: "test",
                name: "user relationship",
                constraints: {
                  type: "array",
                  presence: false,
                },
                relationshipType: RelationshipType.ONE_TO_MANY,
                tableId: InternalTable.USER_METADATA,
              },
            },
          })

          const rows = await Promise.all(
            users.map(u =>
              config.api.row.save(table._id!, { "user relationship": [u] })
            )
          )

          await config.api.table.migrate(table._id!, {
            oldColumn: "user relationship",
            newColumn: "user column",
          })

          const migratedTable = await config.api.table.get(table._id!)
          expect(migratedTable.schema["user column"]).toEqual({
            name: "user column",
            type: FieldType.BB_REFERENCE_SINGLE,
            subtype: BBReferenceFieldSubType.USER,
          })
          expect(migratedTable.schema["user relationship"]).not.toBeDefined()

          const migratedRows = await config.api.row.fetch(table._id!)

          rows.sort((a, b) => a._id!.localeCompare(b._id!))
          migratedRows.sort((a, b) => a._id!.localeCompare(b._id!))

          for (const [i, row] of rows.entries()) {
            const migratedRow = migratedRows[i]
            expect(migratedRow["user column"]).toBeDefined()
            expect(migratedRow["user relationship"]).not.toBeDefined()
            expect(row["user relationship"][0]._id).toEqual(
              migratedRow["user column"]._id
            )
          }
        })

        it("should succeed when the row is created from the other side of the relationship", async () => {
          // We found a bug just after releasing this feature where if the row was created from the
          // users table, not the table linking to it, the migration would succeed but lose the data.
          // This happened because the order of the documents in the link was reversed.
          const table = await config.api.table.save({
            name: "table",
            type: "table",
            sourceId: INTERNAL_TABLE_SOURCE_ID,
            sourceType: TableSourceType.INTERNAL,
            schema: {
              "user relationship": {
                type: FieldType.LINK,
                fieldName: "test",
                name: "user relationship",
                constraints: {
                  type: "array",
                  presence: false,
                },
                relationshipType: RelationshipType.MANY_TO_ONE,
                tableId: InternalTable.USER_METADATA,
              },
            },
          })

          let testRow = await config.api.row.save(table._id!, {})

          await Promise.all(
            users.map(u =>
              config.api.row.patch(InternalTable.USER_METADATA, {
                tableId: InternalTable.USER_METADATA,
                _rev: u._rev!,
                _id: u._id!,
                test: [testRow],
              })
            )
          )

          await config.api.table.migrate(table._id!, {
            oldColumn: "user relationship",
            newColumn: "user column",
          })

          const migratedTable = await config.api.table.get(table._id!)
          expect(migratedTable.schema["user column"]).toEqual({
            name: "user column",
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USER,
            constraints: {
              type: "array",
            },
          })
          expect(migratedTable.schema["user relationship"]).not.toBeDefined()

          const migratedRow = await config.api.row.get(table._id!, testRow._id!)

          expect(migratedRow["user column"]).toBeDefined()
          expect(migratedRow["user relationship"]).not.toBeDefined()
          expect(migratedRow["user column"]).toHaveLength(3)
          expect(migratedRow["user column"].map((u: Row) => u._id)).toEqual(
            expect.arrayContaining(users.map(u => u._id))
          )
        })

        it("should successfully migrate a many-to-many user relationship to a users column", async () => {
          const table = await config.api.table.save({
            name: "table",
            type: "table",
            sourceId: INTERNAL_TABLE_SOURCE_ID,
            sourceType: TableSourceType.INTERNAL,
            schema: {
              "user relationship": {
                type: FieldType.LINK,
                fieldName: "test",
                name: "user relationship",
                constraints: {
                  type: "array",
                  presence: false,
                },
                relationshipType: RelationshipType.MANY_TO_MANY,
                tableId: InternalTable.USER_METADATA,
              },
            },
          })

          const row1 = await config.api.row.save(table._id!, {
            "user relationship": [users[0], users[1]],
          })

          const row2 = await config.api.row.save(table._id!, {
            "user relationship": [users[1], users[2]],
          })

          await config.api.table.migrate(table._id!, {
            oldColumn: "user relationship",
            newColumn: "user column",
          })

          const migratedTable = await config.api.table.get(table._id!)
          expect(migratedTable.schema["user column"]).toEqual({
            name: "user column",
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USER,
            constraints: {
              type: "array",
            },
          })
          expect(migratedTable.schema["user relationship"]).not.toBeDefined()

          const row1Migrated = await config.api.row.get(table._id!, row1._id!)
          expect(row1Migrated["user relationship"]).not.toBeDefined()
          expect(row1Migrated["user column"].map((r: Row) => r._id)).toEqual(
            expect.arrayContaining([users[0]._id, users[1]._id])
          )

          const row2Migrated = await config.api.row.get(table._id!, row2._id!)
          expect(row2Migrated["user relationship"]).not.toBeDefined()
          expect(row2Migrated["user column"].map((r: Row) => r._id)).toEqual(
            expect.arrayContaining([users[1]._id, users[2]._id])
          )
        })

        it("should successfully migrate a many-to-one user relationship to a users column", async () => {
          const table = await config.api.table.save({
            name: "table",
            type: "table",
            sourceId: INTERNAL_TABLE_SOURCE_ID,
            sourceType: TableSourceType.INTERNAL,
            schema: {
              "user relationship": {
                type: FieldType.LINK,
                fieldName: "test",
                name: "user relationship",
                constraints: {
                  type: "array",
                  presence: false,
                },
                relationshipType: RelationshipType.MANY_TO_ONE,
                tableId: InternalTable.USER_METADATA,
              },
            },
          })

          const row1 = await config.api.row.save(table._id!, {
            "user relationship": [users[0], users[1]],
          })

          const row2 = await config.api.row.save(table._id!, {
            "user relationship": [users[2]],
          })

          await config.api.table.migrate(table._id!, {
            oldColumn: "user relationship",
            newColumn: "user column",
          })

          const migratedTable = await config.api.table.get(table._id!)
          expect(migratedTable.schema["user column"]).toEqual({
            name: "user column",
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USER,
            constraints: {
              type: "array",
            },
          })
          expect(migratedTable.schema["user relationship"]).not.toBeDefined()

          const row1Migrated = await config.api.row.get(table._id!, row1._id!)
          expect(row1Migrated["user relationship"]).not.toBeDefined()
          expect(row1Migrated["user column"].map((r: Row) => r._id)).toEqual(
            expect.arrayContaining([users[0]._id, users[1]._id])
          )

          const row2Migrated = await config.api.row.get(table._id!, row2._id!)
          expect(row2Migrated["user relationship"]).not.toBeDefined()
          expect(row2Migrated["user column"].map((r: Row) => r._id)).toEqual([
            users[2]._id,
          ])
        })

        describe("unhappy paths", () => {
          let table: Table
          beforeAll(async () => {
            table = await config.api.table.save(
              tableForDatasource(datasource, {
                schema: {
                  "user relationship": {
                    type: FieldType.LINK,
                    fieldName: "test",
                    name: "user relationship",
                    constraints: {
                      type: "array",
                      presence: false,
                    },
                    relationshipType: RelationshipType.MANY_TO_ONE,
                    tableId: InternalTable.USER_METADATA,
                  },
                  num: {
                    type: FieldType.NUMBER,
                    name: "num",
                    constraints: {
                      type: "number",
                      presence: false,
                    },
                  },
                },
              })
            )
          })

          it("should fail if the new column name is blank", async () => {
            await config.api.table.migrate(
              table._id!,
              {
                oldColumn: "user relationship",
                newColumn: "",
              },
              { status: 400 }
            )
          })

          it("should fail if the new column name is a reserved name", async () => {
            await config.api.table.migrate(
              table._id!,
              {
                oldColumn: "user relationship",
                newColumn: "_id",
              },
              { status: 400 }
            )
          })

          it("should fail if the new column name is the same as an existing column", async () => {
            await config.api.table.migrate(
              table._id!,
              {
                oldColumn: "user relationship",
                newColumn: "num",
              },
              { status: 400 }
            )
          })

          it("should fail if the old column name isn't a column in the table", async () => {
            await config.api.table.migrate(
              table._id!,
              {
                oldColumn: "not a column",
                newColumn: "new column",
              },
              { status: 400 }
            )
          })
        })
      })

      describe.each([
        [
          RowExportFormat.CSV,
          (val: any) => JSON.stringify(val).replace(/"/g, "'"),
        ],
        [RowExportFormat.JSON, (val: any) => val],
      ])("import validation (%s)", (_, userParser) => {
        const basicSchema: TableSchema = {
          id: {
            type: FieldType.NUMBER,
            name: "id",
          },
          name: {
            type: FieldType.STRING,
            name: "name",
          },
        }

        const importCases: [
          string,
          (
            rows: Row[],
            schema: TableSchema
          ) => Promise<ValidateTableImportResponse>
        ][] = [
          [
            "validateNewTableImport",
            async (rows: Row[], schema: TableSchema) => {
              const result = await config.api.table.validateNewTableImport({
                rows,
                schema,
              })
              return result
            },
          ],
          [
            "validateExistingTableImport",
            async (rows: Row[], schema: TableSchema) => {
              const table = await config.api.table.save(
                tableForDatasource(datasource, {
                  primary: ["id"],
                  schema,
                })
              )
              const result = await config.api.table.validateExistingTableImport(
                {
                  tableId: table._id,
                  rows,
                }
              )
              return result
            },
          ],
        ]

        describe.each(importCases)("%s", (_, testDelegate) => {
          it("validates basic imports", async () => {
            const result = await testDelegate(
              [{ id: generator.natural(), name: generator.first() }],
              basicSchema
            )

            expect(result).toEqual({
              allValid: true,
              errors: {},
              invalidColumns: [],
              schemaValidation: {
                id: true,
                name: true,
              },
            })
          })

          it.each(
            isInternal ? PROTECTED_INTERNAL_COLUMNS : PROTECTED_EXTERNAL_COLUMNS
          )("don't allow protected names in schema (%s)", async columnName => {
            const result = await config.api.table.validateNewTableImport({
              rows: [
                {
                  id: generator.natural(),
                  name: generator.first(),
                  [columnName]: generator.word(),
                },
              ],
              schema: {
                ...basicSchema,
              },
            })

            expect(result).toEqual({
              allValid: false,
              errors: {
                [columnName]: `${columnName} is a protected column name`,
              },
              invalidColumns: [],
              schemaValidation: {
                id: true,
                name: true,
                [columnName]: false,
              },
            })
          })

          it("does not allow imports without rows", async () => {
            const result = await testDelegate([], basicSchema)

            expect(result).toEqual({
              allValid: false,
              errors: {},
              invalidColumns: [],
              schemaValidation: {},
            })
          })

          it("validates imports with some empty rows", async () => {
            const result = await testDelegate(
              [{}, { id: generator.natural(), name: generator.first() }, {}],
              basicSchema
            )

            expect(result).toEqual({
              allValid: true,
              errors: {},
              invalidColumns: [],
              schemaValidation: {
                id: true,
                name: true,
              },
            })
          })

          isInternal &&
            it.each(
              isInternal
                ? PROTECTED_INTERNAL_COLUMNS
                : PROTECTED_EXTERNAL_COLUMNS
            )(
              "don't allow protected names in the rows (%s)",
              async columnName => {
                const result = await config.api.table.validateNewTableImport({
                  rows: [
                    {
                      id: generator.natural(),
                      name: generator.first(),
                    },
                  ],
                  schema: {
                    ...basicSchema,
                    [columnName]: {
                      name: columnName,
                      type: FieldType.STRING,
                    },
                  },
                })

                expect(result).toEqual({
                  allValid: false,
                  errors: {
                    [columnName]: `${columnName} is a protected column name`,
                  },
                  invalidColumns: [],
                  schemaValidation: {
                    id: true,
                    name: true,
                    [columnName]: false,
                  },
                })
              }
            )

          it("validates required fields and valid rows", async () => {
            const schema: TableSchema = {
              ...basicSchema,
              name: {
                type: FieldType.STRING,
                name: "name",
                constraints: { presence: true },
              },
            }

            const result = await testDelegate(
              [
                { id: generator.natural(), name: generator.first() },
                { id: generator.natural(), name: generator.first() },
              ],
              schema
            )

            expect(result).toEqual({
              allValid: true,
              errors: {},
              invalidColumns: [],
              schemaValidation: {
                id: true,
                name: true,
              },
            })
          })

          it("validates required fields and non-valid rows", async () => {
            const schema: TableSchema = {
              ...basicSchema,
              name: {
                type: FieldType.STRING,
                name: "name",
                constraints: { presence: true },
              },
            }

            const result = await testDelegate(
              [
                { id: generator.natural(), name: generator.first() },
                { id: generator.natural(), name: "" },
              ],
              schema
            )

            expect(result).toEqual({
              allValid: false,
              errors: {},
              invalidColumns: [],
              schemaValidation: {
                id: true,
                name: false,
              },
            })
          })

          describe("bb references", () => {
            const getUserValues = () => ({
              _id: docIds.generateGlobalUserID(),
              primaryDisplay: generator.first(),
              email: generator.email({}),
            })

            it("can validate user column imports", async () => {
              const schema: TableSchema = {
                ...basicSchema,
                user: {
                  type: FieldType.BB_REFERENCE_SINGLE,
                  subtype: BBReferenceFieldSubType.USER,
                  name: "user",
                },
              }

              const result = await testDelegate(
                [
                  {
                    id: generator.natural(),
                    name: generator.first(),
                    user: userParser(getUserValues()),
                  },
                ],
                schema
              )

              expect(result).toEqual({
                allValid: true,
                errors: {},
                invalidColumns: [],
                schemaValidation: {
                  id: true,
                  name: true,
                  user: true,
                },
              })
            })

            it("can validate user column imports with invalid data", async () => {
              const schema: TableSchema = {
                ...basicSchema,
                user: {
                  type: FieldType.BB_REFERENCE_SINGLE,
                  subtype: BBReferenceFieldSubType.USER,
                  name: "user",
                },
              }

              const result = await testDelegate(
                [
                  {
                    id: generator.natural(),
                    name: generator.first(),
                    user: userParser(getUserValues()),
                  },
                  {
                    id: generator.natural(),
                    name: generator.first(),
                    user: "no valid user data",
                  },
                ],
                schema
              )

              expect(result).toEqual({
                allValid: false,
                errors: {},
                invalidColumns: [],
                schemaValidation: {
                  id: true,
                  name: true,
                  user: false,
                },
              })
            })

            it("can validate users column imports", async () => {
              const schema: TableSchema = {
                ...basicSchema,
                user: {
                  type: FieldType.BB_REFERENCE,
                  subtype: BBReferenceFieldSubType.USER,
                  name: "user",
                  externalType: "array",
                },
              }

              const result = await testDelegate(
                [
                  {
                    id: generator.natural(),
                    name: generator.first(),
                    user: userParser([
                      getUserValues(),
                      getUserValues(),
                      getUserValues(),
                    ]),
                  },
                ],
                schema
              )

              expect(result).toEqual({
                allValid: true,
                errors: {},
                invalidColumns: [],
                schemaValidation: {
                  id: true,
                  name: true,
                  user: true,
                },
              })
            })
          })
        })

        describe("validateExistingTableImport", () => {
          isInternal &&
            it("can reimport _id fields for internal tables", async () => {
              const table = await config.api.table.save(
                tableForDatasource(datasource, {
                  primary: ["id"],
                  schema: basicSchema,
                })
              )
              const result = await config.api.table.validateExistingTableImport(
                {
                  tableId: table._id,
                  rows: [
                    {
                      _id: docIds.generateRowID(table._id!),
                      id: generator.natural(),
                      name: generator.first(),
                    },
                  ],
                }
              )

              expect(result).toEqual({
                allValid: true,
                errors: {},
                invalidColumns: [],
                schemaValidation: {
                  _id: true,
                  id: true,
                  name: true,
                },
              })
            })
        })
      })
    }
  )
}
