import {
  DatabaseName,
  getDatasource,
  knexClient,
} from "../../../integrations/tests/utils"

import tk from "timekeeper"
import emitter from "../../../../src/events"
import { outputProcessing } from "../../../utilities/rowProcessor"
import * as setup from "./utilities"
import { context, InternalTable, tenancy } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  AttachmentFieldMetadata,
  AutoFieldSubType,
  Datasource,
  DateFieldMetadata,
  DeleteRow,
  FieldSchema,
  FieldType,
  BBReferenceFieldSubType,
  FormulaType,
  INTERNAL_TABLE_SOURCE_ID,
  NumberFieldMetadata,
  QuotaUsageType,
  RelationshipType,
  Row,
  SaveTableRequest,
  StaticQuotaName,
  Table,
  TableSourceType,
  UpdatedRowEventEmitter,
  TableSchema,
} from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import _, { merge } from "lodash"
import * as uuid from "uuid"
import { Knex } from "knex"

const timestamp = new Date("2023-01-26T11:48:57.597Z").toISOString()
tk.freeze(timestamp)
interface WaitOptions {
  name: string
  matchFn?: (event: any) => boolean
}
async function waitForEvent(
  opts: WaitOptions,
  callback: () => Promise<void>
): Promise<any> {
  const p = new Promise((resolve: any) => {
    const listener = (event: any) => {
      if (opts.matchFn && !opts.matchFn(event)) {
        return
      }
      resolve(event)
      emitter.off(opts.name, listener)
    }
    emitter.on(opts.name, listener)
  })

  await callback()
  return await p
}

describe.each([
  ["internal", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
])("/rows (%s)", (providerType, dsProvider) => {
  const isInternal = dsProvider === undefined
  const isMSSQL = providerType === DatabaseName.SQL_SERVER
  const config = setup.getConfig()

  let table: Table
  let datasource: Datasource | undefined
  let client: Knex | undefined

  beforeAll(async () => {
    await config.init()
    if (dsProvider) {
      const rawDatasource = await dsProvider
      datasource = await config.createDatasource({
        datasource: rawDatasource,
      })
      client = await knexClient(rawDatasource)
    }
  })

  afterAll(async () => {
    setup.afterAll()
  })

  function saveTableRequest(
    // We omit the name field here because it's generated in the function with a
    // high likelihood to be unique. Tests should not have any reason to control
    // the table name they're writing to.
    ...overrides: Partial<Omit<SaveTableRequest, "name">>[]
  ): SaveTableRequest {
    const defaultSchema: TableSchema = {
      id: {
        type: FieldType.AUTO,
        name: "id",
        autocolumn: true,
        constraints: {
          presence: true,
        },
      },
    }

    for (const override of overrides) {
      if (override.primary) {
        delete defaultSchema.id
      }
    }

    const req: SaveTableRequest = {
      name: uuid.v4().substring(0, 10),
      type: "table",
      sourceType: datasource
        ? TableSourceType.EXTERNAL
        : TableSourceType.INTERNAL,
      sourceId: datasource ? datasource._id! : INTERNAL_TABLE_SOURCE_ID,
      primary: ["id"],
      schema: defaultSchema,
    }
    return merge(req, ...overrides)
  }

  function defaultTable(
    // We omit the name field here because it's generated in the function with a
    // high likelihood to be unique. Tests should not have any reason to control
    // the table name they're writing to.
    ...overrides: Partial<Omit<SaveTableRequest, "name">>[]
  ): SaveTableRequest {
    return saveTableRequest(
      {
        primaryDisplay: "name",
        schema: {
          name: {
            type: FieldType.STRING,
            name: "name",
            constraints: {
              type: "string",
            },
          },
          description: {
            type: FieldType.STRING,
            name: "description",
            constraints: {
              type: "string",
            },
          },
        },
      },
      ...overrides
    )
  }

  beforeEach(async () => {
    mocks.licenses.useCloudFree()
  })

  const getRowUsage = async () => {
    const { total } = await config.doInContext(undefined, () =>
      quotas.getCurrentUsageValues(QuotaUsageType.STATIC, StaticQuotaName.ROWS)
    )
    return total
  }

  const assertRowUsage = async (expected: number) => {
    const usage = await getRowUsage()

    // Because our quota tracking is not perfect, we allow a 10% margin of
    // error.  This is to account for the fact that parallel writes can result
    // in some quota updates getting lost. We don't have any need to solve this
    // right now, so we just allow for some error.
    if (expected === 0) {
      expect(usage).toEqual(0)
      return
    }
    expect(usage).toBeGreaterThan(expected * 0.9)
    expect(usage).toBeLessThan(expected * 1.1)
  }

  const defaultRowFields = isInternal
    ? {
        type: "row",
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    : undefined

  beforeAll(async () => {
    table = await config.api.table.save(defaultTable())
  })

  describe("create", () => {
    it("creates a new row successfully", async () => {
      const rowUsage = await getRowUsage()
      const row = await config.api.row.save(table._id!, {
        name: "Test Contact",
      })
      expect(row.name).toEqual("Test Contact")
      expect(row._rev).toBeDefined()
      await assertRowUsage(isInternal ? rowUsage + 1 : rowUsage)
    })

    it("fails to create a row for a table that does not exist", async () => {
      const rowUsage = await getRowUsage()
      await config.api.row.save("1234567", {}, { status: 404 })
      await assertRowUsage(rowUsage)
    })

    it("fails to create a row if required fields are missing", async () => {
      const rowUsage = await getRowUsage()
      const table = await config.api.table.save(
        saveTableRequest({
          schema: {
            required: {
              type: FieldType.STRING,
              name: "required",
              constraints: {
                type: "string",
                presence: true,
              },
            },
          },
        })
      )
      await config.api.row.save(
        table._id!,
        {},
        {
          status: 500,
          body: {
            validationErrors: {
              required: ["can't be blank"],
            },
          },
        }
      )
      await assertRowUsage(rowUsage)
    })

    isInternal &&
      it("increment row autoId per create row request", async () => {
        const rowUsage = await getRowUsage()

        const newTable = await config.api.table.save(
          saveTableRequest({
            schema: {
              "Row ID": {
                name: "Row ID",
                type: FieldType.NUMBER,
                subtype: AutoFieldSubType.AUTO_ID,
                icon: "ri-magic-line",
                autocolumn: true,
                constraints: {
                  type: "number",
                  presence: true,
                  numericality: {
                    greaterThanOrEqualTo: "",
                    lessThanOrEqualTo: "",
                  },
                },
              },
            },
          })
        )

        let previousId = 0
        for (let i = 0; i < 10; i++) {
          const row = await config.api.row.save(newTable._id!, {})
          expect(row["Row ID"]).toBeGreaterThan(previousId)
          previousId = row["Row ID"]
        }
        await assertRowUsage(isInternal ? rowUsage + 10 : rowUsage)
      })

    isInternal &&
      it("should increment auto ID correctly when creating rows in parallel", async () => {
        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              "Row ID": {
                name: "Row ID",
                type: FieldType.NUMBER,
                subtype: AutoFieldSubType.AUTO_ID,
                icon: "ri-magic-line",
                autocolumn: true,
                constraints: {
                  type: "number",
                  presence: true,
                  numericality: {
                    greaterThanOrEqualTo: "",
                    lessThanOrEqualTo: "",
                  },
                },
              },
            },
          })
        )

        const sequence = Array(50)
          .fill(0)
          .map((_, i) => i + 1)

        // This block of code is simulating users creating auto ID rows at the
        // same time. It's expected that this operation will sometimes return
        // a document conflict error (409), but the idea is to retry in those
        // situations. The code below does this a large number of times with
        // small, random delays between them to try and get through the list
        // as quickly as possible.
        await Promise.all(
          sequence.map(async () => {
            const attempts = 30
            for (let attempt = 0; attempt < attempts; attempt++) {
              try {
                await config.api.row.save(table._id!, {})
                return
              } catch (e) {
                await new Promise(r => setTimeout(r, Math.random() * 50))
              }
            }
            throw new Error(`Failed to create row after ${attempts} attempts`)
          })
        )

        const rows = await config.api.row.fetch(table._id!)
        expect(rows).toHaveLength(50)

        // The main purpose of this test is to ensure that even under pressure,
        // we maintain data integrity. An auto ID column should hand out
        // monotonically increasing unique integers no matter what.
        const ids = rows.map(r => r["Row ID"])
        expect(ids).toEqual(expect.arrayContaining(sequence))
      })

    isInternal &&
      it("row values are coerced", async () => {
        const str: FieldSchema = {
          type: FieldType.STRING,
          name: "str",
          constraints: { type: "string", presence: false },
        }
        const singleAttachment: FieldSchema = {
          type: FieldType.ATTACHMENT_SINGLE,
          name: "single attachment",
          constraints: { presence: false },
        }
        const attachmentList: AttachmentFieldMetadata = {
          type: FieldType.ATTACHMENTS,
          name: "attachments",
          constraints: { type: "array", presence: false },
        }
        const signature: FieldSchema = {
          type: FieldType.SIGNATURE_SINGLE,
          name: "signature",
          constraints: { presence: false },
        }
        const bool: FieldSchema = {
          type: FieldType.BOOLEAN,
          name: "boolean",
          constraints: { type: "boolean", presence: false },
        }
        const number: NumberFieldMetadata = {
          type: FieldType.NUMBER,
          name: "str",
          constraints: { type: "number", presence: false },
        }
        const datetime: DateFieldMetadata = {
          type: FieldType.DATETIME,
          name: "datetime",
          constraints: {
            type: "string",
            presence: false,
            datetime: { earliest: "", latest: "" },
          },
        }
        const arrayField: FieldSchema = {
          type: FieldType.ARRAY,
          constraints: {
            type: "array",
            presence: false,
            inclusion: ["One", "Two", "Three"],
          },
          name: "Sample Tags",
          sortable: false,
        }
        const optsField: FieldSchema = {
          name: "Sample Opts",
          type: FieldType.OPTIONS,
          constraints: {
            type: "string",
            presence: false,
            inclusion: ["Alpha", "Beta", "Gamma"],
          },
        }
        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              name: str,
              stringUndefined: str,
              stringNull: str,
              stringString: str,
              numberEmptyString: number,
              numberNull: number,
              numberUndefined: number,
              numberString: number,
              numberNumber: number,
              datetimeEmptyString: datetime,
              datetimeNull: datetime,
              datetimeUndefined: datetime,
              datetimeString: datetime,
              datetimeDate: datetime,
              boolNull: bool,
              boolEmpty: bool,
              boolUndefined: bool,
              boolString: bool,
              boolBool: bool,
              singleAttachmentNull: singleAttachment,
              singleAttachmentUndefined: singleAttachment,
              attachmentListNull: attachmentList,
              attachmentListUndefined: attachmentList,
              attachmentListEmpty: attachmentList,
              attachmentListEmptyArrayStr: attachmentList,
              signatureNull: signature,
              signatureUndefined: signature,
              arrayFieldEmptyArrayStr: arrayField,
              arrayFieldArrayStrKnown: arrayField,
              arrayFieldNull: arrayField,
              arrayFieldUndefined: arrayField,
              optsFieldEmptyStr: optsField,
              optsFieldUndefined: optsField,
              optsFieldNull: optsField,
              optsFieldStrKnown: optsField,
            },
          })
        )

        const datetimeStr = "1984-04-20T00:00:00.000Z"

        const row = await config.api.row.save(table._id!, {
          name: "Test Row",
          stringUndefined: undefined,
          stringNull: null,
          stringString: "i am a string",
          numberEmptyString: "",
          numberNull: null,
          numberUndefined: undefined,
          numberString: "123",
          numberNumber: 123,
          datetimeEmptyString: "",
          datetimeNull: null,
          datetimeUndefined: undefined,
          datetimeString: datetimeStr,
          datetimeDate: new Date(datetimeStr),
          boolNull: null,
          boolEmpty: "",
          boolUndefined: undefined,
          boolString: "true",
          boolBool: true,
          tableId: table._id,
          singleAttachmentNull: null,
          singleAttachmentUndefined: undefined,
          attachmentListNull: null,
          attachmentListUndefined: undefined,
          attachmentListEmpty: "",
          attachmentListEmptyArrayStr: "[]",
          signatureNull: null,
          signatureUndefined: undefined,
          arrayFieldEmptyArrayStr: "[]",
          arrayFieldUndefined: undefined,
          arrayFieldNull: null,
          arrayFieldArrayStrKnown: "['One']",
          optsFieldEmptyStr: "",
          optsFieldUndefined: undefined,
          optsFieldNull: null,
          optsFieldStrKnown: "Alpha",
        })

        expect(row.stringUndefined).toBe(undefined)
        expect(row.stringNull).toBe(null)
        expect(row.stringString).toBe("i am a string")
        expect(row.numberEmptyString).toBe(null)
        expect(row.numberNull).toBe(null)
        expect(row.numberUndefined).toBe(undefined)
        expect(row.numberString).toBe(123)
        expect(row.numberNumber).toBe(123)
        expect(row.datetimeEmptyString).toBe(null)
        expect(row.datetimeNull).toBe(null)
        expect(row.datetimeUndefined).toBe(undefined)
        expect(row.datetimeString).toBe(new Date(datetimeStr).toISOString())
        expect(row.datetimeDate).toBe(new Date(datetimeStr).toISOString())
        expect(row.boolNull).toBe(null)
        expect(row.boolEmpty).toBe(null)
        expect(row.boolUndefined).toBe(undefined)
        expect(row.boolString).toBe(true)
        expect(row.boolBool).toBe(true)
        expect(row.singleAttachmentNull).toEqual(null)
        expect(row.singleAttachmentUndefined).toBe(undefined)
        expect(row.attachmentListNull).toEqual([])
        expect(row.attachmentListUndefined).toBe(undefined)
        expect(row.attachmentListEmpty).toEqual([])
        expect(row.attachmentListEmptyArrayStr).toEqual([])
        expect(row.signatureNull).toEqual(null)
        expect(row.signatureUndefined).toBe(undefined)
        expect(row.arrayFieldEmptyArrayStr).toEqual([])
        expect(row.arrayFieldNull).toEqual([])
        expect(row.arrayFieldUndefined).toEqual(undefined)
        expect(row.optsFieldEmptyStr).toEqual(null)
        expect(row.optsFieldUndefined).toEqual(undefined)
        expect(row.optsFieldNull).toEqual(null)
        expect(row.arrayFieldArrayStrKnown).toEqual(["One"])
        expect(row.optsFieldStrKnown).toEqual("Alpha")
      })

    isInternal &&
      it("doesn't allow creating in user table", async () => {
        const response = await config.api.row.save(
          InternalTable.USER_METADATA,
          {
            firstName: "Joe",
            lastName: "Joe",
            email: "joe@joe.com",
            roles: {},
          },
          { status: 400 }
        )
        expect(response.message).toBe("Cannot create new user entry.")
      })

    it("should not mis-parse date string out of JSON", async () => {
      const table = await config.api.table.save(
        saveTableRequest({
          schema: {
            name: {
              type: FieldType.STRING,
              name: "name",
            },
          },
        })
      )

      const row = await config.api.row.save(table._id!, {
        name: `{ "foo": "2023-01-26T11:48:57.000Z" }`,
      })

      expect(row.name).toEqual(`{ "foo": "2023-01-26T11:48:57.000Z" }`)
    })
  })

  describe("get", () => {
    it("reads an existing row successfully", async () => {
      const existing = await config.api.row.save(table._id!, {})

      const res = await config.api.row.get(table._id!, existing._id!)

      expect(res).toEqual({
        ...existing,
        ...defaultRowFields,
      })
    })

    it("returns 404 when row does not exist", async () => {
      const table = await config.api.table.save(defaultTable())
      await config.api.row.save(table._id!, {})
      await config.api.row.get(table._id!, "1234567", {
        status: 404,
      })
    })
  })

  describe("fetch", () => {
    it("fetches all rows for given tableId", async () => {
      const table = await config.api.table.save(defaultTable())
      const rows = await Promise.all([
        config.api.row.save(table._id!, {}),
        config.api.row.save(table._id!, {}),
      ])

      const res = await config.api.row.fetch(table._id!)
      expect(res.map(r => r._id)).toEqual(
        expect.arrayContaining(rows.map(r => r._id))
      )
    })

    it("returns 404 when table does not exist", async () => {
      await config.api.row.fetch("1234567", { status: 404 })
    })
  })

  describe("update", () => {
    it("updates an existing row successfully", async () => {
      const existing = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      const res = await config.api.row.save(table._id!, {
        _id: existing._id,
        _rev: existing._rev,
        name: "Updated Name",
      })

      expect(res.name).toEqual("Updated Name")
      await assertRowUsage(rowUsage)
    })

    !isInternal &&
      it("can update a row on an external table with a primary key", async () => {
        const tableName = uuid.v4().substring(0, 10)
        await client!.schema.createTable(tableName, table => {
          table.increments("id").primary()
          table.string("name")
        })

        const res = await config.api.datasource.fetchSchema({
          datasourceId: datasource!._id!,
        })
        const table = res.datasource.entities![tableName]

        const row = await config.api.row.save(table._id!, {
          id: 1,
          name: "Row 1",
        })

        const updatedRow = await config.api.row.save(table._id!, {
          _id: row._id!,
          name: "Row 1 Updated",
        })

        expect(updatedRow.name).toEqual("Row 1 Updated")

        const rows = await config.api.row.fetch(table._id!)
        expect(rows).toHaveLength(1)
      })
  })

  describe("patch", () => {
    let otherTable: Table

    beforeAll(async () => {
      table = await config.api.table.save(defaultTable())
      otherTable = await config.api.table.save(
        defaultTable({
          schema: {
            relationship: {
              name: "relationship",
              relationshipType: RelationshipType.ONE_TO_MANY,
              type: FieldType.LINK,
              tableId: table._id!,
              fieldName: "relationship",
            },
          },
        })
      )
    })

    it("should update only the fields that are supplied", async () => {
      const existing = await config.api.row.save(table._id!, {})

      const rowUsage = await getRowUsage()

      const row = await config.api.row.patch(table._id!, {
        _id: existing._id!,
        _rev: existing._rev!,
        tableId: table._id!,
        name: "Updated Name",
      })

      expect(row.name).toEqual("Updated Name")
      expect(row.description).toEqual(existing.description)

      const savedRow = await config.api.row.get(table._id!, row._id!)

      expect(savedRow.description).toEqual(existing.description)
      expect(savedRow.name).toEqual("Updated Name")
      await assertRowUsage(rowUsage)
    })

    it("should update only the fields that are supplied and emit the correct oldRow", async () => {
      let beforeRow = await config.api.row.save(table._id!, {
        name: "test",
        description: "test",
      })
      const opts = {
        name: "row:update",
        matchFn: (event: UpdatedRowEventEmitter) =>
          event.row._id === beforeRow._id,
      }
      const event = await waitForEvent(opts, async () => {
        await config.api.row.patch(table._id!, {
          _id: beforeRow._id!,
          _rev: beforeRow._rev!,
          tableId: table._id!,
          name: "Updated Name",
        })
      })

      expect(event.oldRow).toBeDefined()
      expect(event.oldRow.name).toEqual("test")
      expect(event.row.name).toEqual("Updated Name")
      expect(event.oldRow.description).toEqual(beforeRow.description)
      expect(event.row.description).toEqual(beforeRow.description)
    })

    it("should throw an error when given improper types", async () => {
      const existing = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      await config.api.row.patch(
        table._id!,
        {
          _id: existing._id!,
          _rev: existing._rev!,
          tableId: table._id!,
          name: 1,
        },
        { status: 400 }
      )

      await assertRowUsage(rowUsage)
    })

    it("should not overwrite links if those links are not set", async () => {
      let linkField: FieldSchema = {
        type: FieldType.LINK,
        name: "",
        fieldName: "",
        constraints: {
          type: "array",
          presence: false,
        },
        relationshipType: RelationshipType.ONE_TO_MANY,
        tableId: InternalTable.USER_METADATA,
      }

      let table = await config.api.table.save({
        name: "TestTable",
        type: "table",
        sourceType: TableSourceType.INTERNAL,
        sourceId: INTERNAL_TABLE_SOURCE_ID,
        schema: {
          user1: { ...linkField, name: "user1", fieldName: "user1" },
          user2: { ...linkField, name: "user2", fieldName: "user2" },
        },
      })

      let user1 = await config.createUser()
      let user2 = await config.createUser()

      let row = await config.api.row.save(table._id!, {
        user1: [{ _id: user1._id }],
        user2: [{ _id: user2._id }],
      })

      let getResp = await config.api.row.get(table._id!, row._id!)
      expect(getResp.user1[0]._id).toEqual(user1._id)
      expect(getResp.user2[0]._id).toEqual(user2._id)

      let patchResp = await config.api.row.patch(table._id!, {
        _id: row._id!,
        _rev: row._rev!,
        tableId: table._id!,
        user1: [{ _id: user2._id }],
      })
      expect(patchResp.user1[0]._id).toEqual(user2._id)
      expect(patchResp.user2[0]._id).toEqual(user2._id)

      getResp = await config.api.row.get(table._id!, row._id!)
      expect(getResp.user1[0]._id).toEqual(user2._id)
      expect(getResp.user2[0]._id).toEqual(user2._id)
    })

    it("should be able to update relationships when both columns are same name", async () => {
      let row = await config.api.row.save(table._id!, {
        name: "test",
        description: "test",
      })
      let row2 = await config.api.row.save(otherTable._id!, {
        name: "test",
        description: "test",
        relationship: [row._id],
      })
      row = await config.api.row.get(table._id!, row._id!)
      expect(row.relationship.length).toBe(1)
      const resp = await config.api.row.patch(table._id!, {
        _id: row._id!,
        _rev: row._rev!,
        tableId: row.tableId!,
        name: "test2",
        relationship: [row2._id],
      })
      expect(resp.relationship.length).toBe(1)
    })

    !isInternal &&
      // MSSQL needs a setting called IDENTITY_INSERT to be set to ON to allow writing
      // to identity columns. This is not something Budibase does currently.
      providerType !== DatabaseName.SQL_SERVER &&
      it("should support updating fields that are part of a composite key", async () => {
        const tableRequest = saveTableRequest({
          primary: ["number", "string"],
          schema: {
            string: {
              type: FieldType.STRING,
              name: "string",
            },
            number: {
              type: FieldType.NUMBER,
              name: "number",
            },
          },
        })

        delete tableRequest.schema.id

        const table = await config.api.table.save(tableRequest)

        const stringValue = generator.word()
        const naturalValue = generator.integer({ min: 0, max: 1000 })

        const existing = await config.api.row.save(table._id!, {
          string: stringValue,
          number: naturalValue,
        })

        expect(existing._id).toEqual(`%5B${naturalValue}%2C'${stringValue}'%5D`)

        const row = await config.api.row.patch(table._id!, {
          _id: existing._id!,
          _rev: existing._rev!,
          tableId: table._id!,
          string: stringValue,
          number: 1500,
        })

        expect(row._id).toEqual(`%5B${"1500"}%2C'${stringValue}'%5D`)
      })
  })

  describe("destroy", () => {
    beforeAll(async () => {
      table = await config.api.table.save(defaultTable())
    })

    it("should be able to delete a row", async () => {
      const createdRow = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      const res = await config.api.row.bulkDelete(table._id!, {
        rows: [createdRow],
      })
      expect(res[0]._id).toEqual(createdRow._id)
      await assertRowUsage(isInternal ? rowUsage - 1 : rowUsage)
    })

    it("should be able to bulk delete rows, including a row that doesn't exist", async () => {
      const createdRow = await config.api.row.save(table._id!, {})
      const createdRow2 = await config.api.row.save(table._id!, {})

      const res = await config.api.row.bulkDelete(table._id!, {
        rows: [createdRow, createdRow2, { _id: "9999999" }],
      })

      expect(res.map(r => r._id)).toEqual(
        expect.arrayContaining([createdRow._id, createdRow2._id])
      )
      expect(res.length).toEqual(2)
    })
  })

  describe("validate", () => {
    beforeAll(async () => {
      table = await config.api.table.save(defaultTable())
    })

    it("should return no errors on valid row", async () => {
      const rowUsage = await getRowUsage()

      const res = await config.api.row.validate(table._id!, { name: "ivan" })

      expect(res.valid).toBe(true)
      expect(Object.keys(res.errors)).toEqual([])
      await assertRowUsage(rowUsage)
    })

    it("should errors on invalid row", async () => {
      const rowUsage = await getRowUsage()

      const res = await config.api.row.validate(table._id!, { name: 1 })

      if (isInternal) {
        expect(res.valid).toBe(false)
        expect(Object.keys(res.errors)).toEqual(["name"])
      } else {
        // Validation for external is not implemented, so it will always return valid
        expect(res.valid).toBe(true)
        expect(Object.keys(res.errors)).toEqual([])
      }
      await assertRowUsage(rowUsage)
    })
  })

  describe("bulkDelete", () => {
    beforeAll(async () => {
      table = await config.api.table.save(defaultTable())
    })

    it("should be able to delete a bulk set of rows", async () => {
      const row1 = await config.api.row.save(table._id!, {})
      const row2 = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      const res = await config.api.row.bulkDelete(table._id!, {
        rows: [row1, row2],
      })

      expect(res.length).toEqual(2)
      await config.api.row.get(table._id!, row1._id!, { status: 404 })
      await assertRowUsage(isInternal ? rowUsage - 2 : rowUsage)
    })

    it("should be able to delete a variety of row set types", async () => {
      const [row1, row2, row3] = await Promise.all([
        config.api.row.save(table._id!, {}),
        config.api.row.save(table._id!, {}),
        config.api.row.save(table._id!, {}),
      ])
      const rowUsage = await getRowUsage()

      const res = await config.api.row.bulkDelete(table._id!, {
        rows: [row1, row2._id!, { _id: row3._id }],
      })

      expect(res.length).toEqual(3)
      await config.api.row.get(table._id!, row1._id!, { status: 404 })
      await assertRowUsage(isInternal ? rowUsage - 3 : rowUsage)
    })

    it("should accept a valid row object and delete the row", async () => {
      const row1 = await config.api.row.save(table._id!, {})
      const rowUsage = await getRowUsage()

      const res = await config.api.row.delete(table._id!, row1 as DeleteRow)

      expect(res.id).toEqual(row1._id)
      await config.api.row.get(table._id!, row1._id!, { status: 404 })
      await assertRowUsage(isInternal ? rowUsage - 1 : rowUsage)
    })

    it.each([{ not: "valid" }, { rows: 123 }, "invalid"])(
      "Should ignore malformed/invalid delete request: %s",
      async (request: any) => {
        const rowUsage = await getRowUsage()

        await config.api.row.delete(table._id!, request, {
          status: 400,
          body: {
            message: "Invalid delete rows request",
          },
        })

        await assertRowUsage(rowUsage)
      }
    )
  })

  describe("bulkImport", () => {
    isInternal &&
      it("should update Auto ID field after bulk import", async () => {
        const table = await config.api.table.save(
          saveTableRequest({
            primary: ["autoId"],
            schema: {
              autoId: {
                name: "autoId",
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

        let row = await config.api.row.save(table._id!, {})
        expect(row.autoId).toEqual(1)

        await config.api.row.bulkImport(table._id!, {
          rows: [{ autoId: 2 }],
        })

        row = await config.api.row.save(table._id!, {})
        expect(row.autoId).toEqual(3)
      })

    it("should be able to bulkImport rows", async () => {
      const table = await config.api.table.save(
        saveTableRequest({
          schema: {
            name: {
              type: FieldType.STRING,
              name: "name",
            },
            description: {
              type: FieldType.STRING,
              name: "description",
            },
          },
        })
      )

      const rowUsage = await getRowUsage()

      await config.api.row.bulkImport(table._id!, {
        rows: [
          {
            name: "Row 1",
            description: "Row 1 description",
          },
          {
            name: "Row 2",
            description: "Row 2 description",
          },
        ],
      })

      const rows = await config.api.row.fetch(table._id!)
      expect(rows.length).toEqual(2)

      rows.sort((a, b) => a.name.localeCompare(b.name))
      expect(rows[0].name).toEqual("Row 1")
      expect(rows[0].description).toEqual("Row 1 description")
      expect(rows[1].name).toEqual("Row 2")
      expect(rows[1].description).toEqual("Row 2 description")

      await assertRowUsage(isInternal ? rowUsage + 2 : rowUsage)
    })

    // Upserting isn't yet supported in MSSQL, see:
    //   https://github.com/knex/knex/pull/6050
    !isMSSQL &&
      it("should be able to update existing rows with bulkImport", async () => {
        const table = await config.api.table.save(
          saveTableRequest({
            primary: ["userId"],
            schema: {
              userId: {
                type: FieldType.NUMBER,
                name: "userId",
                constraints: {
                  presence: true,
                },
              },
              name: {
                type: FieldType.STRING,
                name: "name",
              },
              description: {
                type: FieldType.STRING,
                name: "description",
              },
            },
          })
        )

        const row1 = await config.api.row.save(table._id!, {
          userId: 1,
          name: "Row 1",
          description: "Row 1 description",
        })

        const row2 = await config.api.row.save(table._id!, {
          userId: 2,
          name: "Row 2",
          description: "Row 2 description",
        })

        await config.api.row.bulkImport(table._id!, {
          identifierFields: ["userId"],
          rows: [
            {
              userId: row1.userId,
              name: "Row 1 updated",
              description: "Row 1 description updated",
            },
            {
              userId: row2.userId,
              name: "Row 2 updated",
              description: "Row 2 description updated",
            },
            {
              userId: 3,
              name: "Row 3",
              description: "Row 3 description",
            },
          ],
        })

        const rows = await config.api.row.fetch(table._id!)
        expect(rows.length).toEqual(3)

        rows.sort((a, b) => a.name.localeCompare(b.name))
        expect(rows[0].name).toEqual("Row 1 updated")
        expect(rows[0].description).toEqual("Row 1 description updated")
        expect(rows[1].name).toEqual("Row 2 updated")
        expect(rows[1].description).toEqual("Row 2 description updated")
        expect(rows[2].name).toEqual("Row 3")
        expect(rows[2].description).toEqual("Row 3 description")
      })

    // Upserting isn't yet supported in MSSQL, see:
    //   https://github.com/knex/knex/pull/6050
    !isMSSQL &&
      !isInternal &&
      it("should be able to update existing rows with composite primary keys with bulkImport", async () => {
        const tableName = uuid.v4()
        await client?.schema.createTable(tableName, table => {
          table.integer("companyId")
          table.integer("userId")
          table.string("name")
          table.string("description")
          table.primary(["companyId", "userId"])
        })

        const resp = await config.api.datasource.fetchSchema({
          datasourceId: datasource!._id!,
        })
        const table = resp.datasource.entities![tableName]

        const row1 = await config.api.row.save(table._id!, {
          companyId: 1,
          userId: 1,
          name: "Row 1",
          description: "Row 1 description",
        })

        const row2 = await config.api.row.save(table._id!, {
          companyId: 1,
          userId: 2,
          name: "Row 2",
          description: "Row 2 description",
        })

        await config.api.row.bulkImport(table._id!, {
          identifierFields: ["companyId", "userId"],
          rows: [
            {
              companyId: 1,
              userId: row1.userId,
              name: "Row 1 updated",
              description: "Row 1 description updated",
            },
            {
              companyId: 1,
              userId: row2.userId,
              name: "Row 2 updated",
              description: "Row 2 description updated",
            },
            {
              companyId: 1,
              userId: 3,
              name: "Row 3",
              description: "Row 3 description",
            },
          ],
        })

        const rows = await config.api.row.fetch(table._id!)
        expect(rows.length).toEqual(3)

        rows.sort((a, b) => a.name.localeCompare(b.name))
        expect(rows[0].name).toEqual("Row 1 updated")
        expect(rows[0].description).toEqual("Row 1 description updated")
        expect(rows[1].name).toEqual("Row 2 updated")
        expect(rows[1].description).toEqual("Row 2 description updated")
        expect(rows[2].name).toEqual("Row 3")
        expect(rows[2].description).toEqual("Row 3 description")
      })

    // Upserting isn't yet supported in MSSQL, see:
    //   https://github.com/knex/knex/pull/6050
    !isMSSQL &&
      !isInternal &&
      it("should be able to update existing rows an autoID primary key", async () => {
        const tableName = uuid.v4()
        await client!.schema.createTable(tableName, table => {
          table.increments("userId").primary()
          table.string("name")
        })

        const resp = await config.api.datasource.fetchSchema({
          datasourceId: datasource!._id!,
        })
        const table = resp.datasource.entities![tableName]

        const row1 = await config.api.row.save(table._id!, {
          name: "Clare",
        })

        const row2 = await config.api.row.save(table._id!, {
          name: "Jeff",
        })

        await config.api.row.bulkImport(table._id!, {
          identifierFields: ["userId"],
          rows: [
            {
              userId: row1.userId,
              name: "Clare updated",
            },
            {
              userId: row2.userId,
              name: "Jeff updated",
            },
          ],
        })

        const rows = await config.api.row.fetch(table._id!)
        expect(rows.length).toEqual(2)

        rows.sort((a, b) => a.name.localeCompare(b.name))
        expect(rows[0].name).toEqual("Clare updated")
        expect(rows[1].name).toEqual("Jeff updated")
      })
  })

  describe("enrich", () => {
    beforeAll(async () => {
      table = await config.api.table.save(defaultTable())
    })

    it("should allow enriching some linked rows", async () => {
      const { linkedTable, firstRow, secondRow } = await tenancy.doInTenant(
        config.getTenantId(),
        async () => {
          const linkedTable = await config.api.table.save(
            defaultTable({
              schema: {
                link: {
                  name: "link",
                  fieldName: "link",
                  type: FieldType.LINK,
                  relationshipType: RelationshipType.ONE_TO_MANY,
                  tableId: table._id!,
                },
              },
            })
          )
          const firstRow = await config.api.row.save(table._id!, {
            name: "Test Contact",
            description: "original description",
          })
          const secondRow = await config.api.row.save(linkedTable._id!, {
            name: "Test 2",
            description: "og desc",
            link: [{ _id: firstRow._id }],
          })
          return { linkedTable, firstRow, secondRow }
        }
      )
      const rowUsage = await getRowUsage()

      // test basic enrichment
      const resBasic = await config.api.row.get(
        linkedTable._id!,
        secondRow._id!
      )
      expect(resBasic.link.length).toBe(1)
      expect(resBasic.link[0]).toEqual({
        _id: firstRow._id,
        primaryDisplay: firstRow.name,
      })

      // test full enrichment
      const resEnriched = await config.api.row.getEnriched(
        linkedTable._id!,
        secondRow._id!
      )
      expect(resEnriched.link.length).toBe(1)
      expect(resEnriched.link[0]._id).toBe(firstRow._id)
      expect(resEnriched.link[0].name).toBe("Test Contact")
      expect(resEnriched.link[0].description).toBe("original description")
      await assertRowUsage(rowUsage)
    })
  })

  isInternal &&
    describe("attachments and signatures", () => {
      const coreAttachmentEnrichment = async (
        schema: any,
        field: string,
        attachmentCfg: string | string[]
      ) => {
        const testTable = await config.api.table.save(
          defaultTable({
            schema,
          })
        )
        const attachmentToStoreKey = (attachmentId: string) => {
          return {
            key: `${config.getAppId()}/attachments/${attachmentId}`,
          }
        }
        const draftRow = {
          name: "test",
          description: "test",
          [field]:
            typeof attachmentCfg === "string"
              ? attachmentToStoreKey(attachmentCfg)
              : attachmentCfg.map(attachmentToStoreKey),
          tableId: testTable._id,
        }
        const row = await config.api.row.save(testTable._id!, draftRow)

        await config.withEnv({ SELF_HOSTED: "true" }, async () => {
          return context.doInAppContext(config.getAppId(), async () => {
            const enriched: Row[] = await outputProcessing(table, [row])
            const [targetRow] = enriched
            const attachmentEntries = Array.isArray(targetRow[field])
              ? targetRow[field]
              : [targetRow[field]]

            for (const entry of attachmentEntries) {
              const attachmentId = entry.key.split("/").pop()
              expect(entry.url.split("?")[0]).toBe(
                `/files/signed/prod-budi-app-assets/${config.getProdAppId()}/attachments/${attachmentId}`
              )
            }
          })
        })
      }

      it("should allow enriching single attachment rows", async () => {
        await coreAttachmentEnrichment(
          {
            attachment: {
              type: FieldType.ATTACHMENT_SINGLE,
              name: "attachment",
              constraints: { presence: false },
            },
          },
          "attachment",
          `${uuid.v4()}.csv`
        )
      })

      it("should allow enriching attachment list rows", async () => {
        await coreAttachmentEnrichment(
          {
            attachments: {
              type: FieldType.ATTACHMENTS,
              name: "attachments",
              constraints: { type: "array", presence: false },
            },
          },
          "attachments",
          [`${uuid.v4()}.csv`]
        )
      })

      it("should allow enriching signature rows", async () => {
        await coreAttachmentEnrichment(
          {
            signature: {
              type: FieldType.SIGNATURE_SINGLE,
              name: "signature",
              constraints: { presence: false },
            },
          },
          "signature",
          `${uuid.v4()}.png`
        )
      })
    })

  describe("exportRows", () => {
    beforeAll(async () => {
      table = await config.api.table.save(defaultTable())
    })

    it("should allow exporting all columns", async () => {
      const existing = await config.api.row.save(table._id!, {})
      const res = await config.api.row.exportRows(table._id!, {
        rows: [existing._id!],
      })
      const results = JSON.parse(res)
      expect(results.length).toEqual(1)
      const row = results[0]

      // Ensure all original columns were exported
      expect(Object.keys(row).length).toBeGreaterThanOrEqual(
        Object.keys(existing).length
      )
      Object.keys(existing).forEach(key => {
        expect(row[key]).toEqual(existing[key])
      })
    })

    it("should allow exporting only certain columns", async () => {
      const existing = await config.api.row.save(table._id!, {})
      const res = await config.api.row.exportRows(table._id!, {
        rows: [existing._id!],
        columns: ["_id"],
      })
      const results = JSON.parse(res)
      expect(results.length).toEqual(1)
      const row = results[0]

      // Ensure only the _id column was exported
      expect(Object.keys(row).length).toEqual(1)
      expect(row._id).toEqual(existing._id)
    })

    it("should handle single quotes in row filtering", async () => {
      const existing = await config.api.row.save(table._id!, {})
      const res = await config.api.row.exportRows(table._id!, {
        rows: [`['${existing._id!}']`],
      })
      const results = JSON.parse(res)
      expect(results.length).toEqual(1)
      const row = results[0]
      expect(row._id).toEqual(existing._id)
    })

    it("should return an error on composite keys", async () => {
      const existing = await config.api.row.save(table._id!, {})
      await config.api.row.exportRows(
        table._id!,
        {
          rows: [`['${existing._id!}']`, "['d001', '10111']"],
        },
        {
          status: 400,
          body: {
            message: "Export data does not support composite keys.",
          },
        }
      )
    })

    it("should return an error if no table is found", async () => {
      const existing = await config.api.row.save(table._id!, {})
      await config.api.row.exportRows(
        "1234567",
        { rows: [existing._id!] },
        { status: 404 }
      )
    })
  })

  let o2mTable: Table
  let m2mTable: Table
  beforeAll(async () => {
    o2mTable = await config.api.table.save(defaultTable())
    m2mTable = await config.api.table.save(defaultTable())
  })

  describe.each([
    [
      "relationship fields",
      (): Record<string, FieldSchema> => ({
        user: {
          name: "user",
          relationshipType: RelationshipType.ONE_TO_MANY,
          type: FieldType.LINK,
          tableId: o2mTable._id!,
          fieldName: "fk_o2m",
        },
        users: {
          name: "users",
          relationshipType: RelationshipType.MANY_TO_MANY,
          type: FieldType.LINK,
          tableId: m2mTable._id!,
          fieldName: "fk_m2m",
        },
      }),
      (tableId: string) =>
        config.api.row.save(tableId, {
          name: uuid.v4(),
          description: generator.paragraph(),
          tableId,
        }),
      (row: Row) => ({
        _id: row._id,
        primaryDisplay: row.name,
      }),
    ],
    [
      "bb reference fields",
      (): Record<string, FieldSchema> => ({
        user: {
          name: "user",
          type: FieldType.BB_REFERENCE,
          subtype: BBReferenceFieldSubType.USER,
        },
        users: {
          name: "users",
          type: FieldType.BB_REFERENCE,
          subtype: BBReferenceFieldSubType.USERS,
        },
      }),
      () => config.createUser(),
      (row: Row) => ({
        _id: row._id,
        primaryDisplay: row.email,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
      }),
    ],
  ])("links - %s", (__, relSchema, dataGenerator, resultMapper) => {
    let tableId: string
    let o2mData: Row[]
    let m2mData: Row[]

    beforeAll(async () => {
      const table = await config.api.table.save(
        defaultTable({ schema: relSchema() })
      )
      tableId = table._id!

      o2mData = [
        await dataGenerator(o2mTable._id!),
        await dataGenerator(o2mTable._id!),
        await dataGenerator(o2mTable._id!),
        await dataGenerator(o2mTable._id!),
      ]

      m2mData = [
        await dataGenerator(m2mTable._id!),
        await dataGenerator(m2mTable._id!),
        await dataGenerator(m2mTable._id!),
        await dataGenerator(m2mTable._id!),
      ]
    })

    it("can save a row when relationship fields are empty", async () => {
      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
      })

      expect(row).toEqual({
        _id: expect.any(String),
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
        name: "foo",
        description: "bar",
        tableId,
      })
    })

    it("can save a row with a single relationship field", async () => {
      const user = _.sample(o2mData)!
      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
        user: [user],
      })

      expect(row).toEqual({
        name: "foo",
        description: "bar",
        tableId,
        user: [user].map(u => resultMapper(u)),
        _id: expect.any(String),
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
        [`fk_${o2mTable.name}_fk_o2m`]: isInternal ? undefined : user.id,
      })
    })

    it("can save a row with a multiple relationship field", async () => {
      const selectedUsers = _.sampleSize(m2mData, 2)
      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
        users: selectedUsers,
      })

      expect(row).toEqual({
        name: "foo",
        description: "bar",
        tableId,
        users: expect.arrayContaining(selectedUsers.map(u => resultMapper(u))),
        _id: expect.any(String),
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
      })
    })

    it("can retrieve rows with no populated relationships", async () => {
      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
      })

      const retrieved = await config.api.row.get(tableId, row._id!)
      expect(retrieved).toEqual({
        name: "foo",
        description: "bar",
        tableId,
        user: undefined,
        users: undefined,
        _id: row._id,
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        ...defaultRowFields,
      })
    })

    it("can retrieve rows with populated relationships", async () => {
      const user1 = _.sample(o2mData)!
      const [user2, user3] = _.sampleSize(m2mData, 2)

      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
        users: [user2, user3],
        user: [user1],
      })

      const retrieved = await config.api.row.get(tableId, row._id!)
      expect(retrieved).toEqual({
        name: "foo",
        description: "bar",
        tableId,
        user: expect.arrayContaining([user1].map(u => resultMapper(u))),
        users: expect.arrayContaining([user2, user3].map(u => resultMapper(u))),
        _id: row._id,
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        [`fk_${o2mTable.name}_fk_o2m`]: isInternal ? undefined : user1.id,
        ...defaultRowFields,
      })
    })

    it("can update an existing populated row", async () => {
      const user = _.sample(o2mData)!
      const [users1, users2, users3] = _.sampleSize(m2mData, 3)

      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
        users: [users1, users2],
      })

      const updatedRow = await config.api.row.save(tableId, {
        ...row,
        user: [user],
        users: [users3, users1],
      })
      expect(updatedRow).toEqual({
        name: "foo",
        description: "bar",
        tableId,
        user: expect.arrayContaining([user].map(u => resultMapper(u))),
        users: expect.arrayContaining(
          [users3, users1].map(u => resultMapper(u))
        ),
        _id: row._id,
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
        [`fk_${o2mTable.name}_fk_o2m`]: isInternal ? undefined : user.id,
      })
    })

    it("can wipe an existing populated relationships in row", async () => {
      const [user1, user2] = _.sampleSize(m2mData, 2)
      const row = await config.api.row.save(tableId, {
        name: "foo",
        description: "bar",
        users: [user1, user2],
      })

      const updatedRow = await config.api.row.save(tableId, {
        ...row,
        user: null,
        users: null,
      })
      expect(updatedRow).toEqual({
        name: "foo",
        description: "bar",
        tableId,
        _id: row._id,
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
      })
    })

    it("fetch all will populate the relationships", async () => {
      const [user1] = _.sampleSize(o2mData, 1)
      const [users1, users2, users3] = _.sampleSize(m2mData, 3)

      const rows = [
        {
          name: generator.name(),
          description: generator.name(),
          users: [users1, users2],
        },
        {
          name: generator.name(),
          description: generator.name(),
          user: [user1],
          users: [users1, users3],
        },
        {
          name: generator.name(),
          description: generator.name(),
          users: [users3],
        },
      ]

      await config.api.row.save(tableId, rows[0])
      await config.api.row.save(tableId, rows[1])
      await config.api.row.save(tableId, rows[2])

      const res = await config.api.row.fetch(tableId)

      expect(res).toEqual(
        expect.arrayContaining(
          rows.map(r => ({
            name: r.name,
            description: r.description,
            tableId,
            user: r.user?.map(u => resultMapper(u)),
            users: r.users?.length
              ? expect.arrayContaining(r.users?.map(u => resultMapper(u)))
              : undefined,
            _id: expect.any(String),
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            [`fk_${o2mTable.name}_fk_o2m`]:
              isInternal || !r.user?.length ? undefined : r.user[0].id,
            ...defaultRowFields,
          }))
        )
      )
    })

    it("search all will populate the relationships", async () => {
      const [user1] = _.sampleSize(o2mData, 1)
      const [users1, users2, users3] = _.sampleSize(m2mData, 3)

      const rows = [
        {
          name: generator.name(),
          description: generator.name(),
          users: [users1, users2],
        },
        {
          name: generator.name(),
          description: generator.name(),
          user: [user1],
          users: [users1, users3],
        },
        {
          name: generator.name(),
          description: generator.name(),
          users: [users3],
        },
      ]

      await config.api.row.save(tableId, rows[0])
      await config.api.row.save(tableId, rows[1])
      await config.api.row.save(tableId, rows[2])

      const res = await config.api.row.search(tableId)

      expect(res).toEqual({
        rows: expect.arrayContaining(
          rows.map(r => ({
            name: r.name,
            description: r.description,
            tableId,
            user: r.user?.map(u => resultMapper(u)),
            users: r.users?.length
              ? expect.arrayContaining(r.users?.map(u => resultMapper(u)))
              : undefined,
            _id: expect.any(String),
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            [`fk_${o2mTable.name}_fk_o2m`]:
              isInternal || !r.user?.length ? undefined : r.user[0].id,
            ...defaultRowFields,
          }))
        ),
        ...(isInternal
          ? {}
          : {
              hasNextPage: false,
            }),
      })
    })
  })

  describe("Formula fields", () => {
    let table: Table
    let otherTable: Table
    let relatedRow: Row

    beforeAll(async () => {
      otherTable = await config.api.table.save(defaultTable())
      table = await config.api.table.save(
        saveTableRequest({
          schema: {
            links: {
              name: "links",
              fieldName: "links",
              type: FieldType.LINK,
              tableId: otherTable._id!,
              relationshipType: RelationshipType.ONE_TO_MANY,
            },
            formula: {
              name: "formula",
              type: FieldType.FORMULA,
              formula: "{{ links.0.name }}",
              formulaType: FormulaType.DYNAMIC,
            },
          },
        })
      )

      relatedRow = await config.api.row.save(otherTable._id!, {
        name: generator.word(),
        description: generator.paragraph(),
      })
      await config.api.row.save(table._id!, {
        name: generator.word(),
        description: generator.paragraph(),
        tableId: table._id!,
        links: [relatedRow._id],
      })
    })

    it("should be able to search for rows containing formulas", async () => {
      const { rows } = await config.api.row.search(table._id!)
      expect(rows.length).toBe(1)
      expect(rows[0].links.length).toBe(1)
      const row = rows[0]
      expect(row.formula).toBe(relatedRow.name)
    })
  })

  describe("Formula JS protection", () => {
    it("should time out JS execution if a single cell takes too long", async () => {
      await config.withEnv({ JS_PER_INVOCATION_TIMEOUT_MS: 40 }, async () => {
        const js = Buffer.from(
          `
              let i = 0;
              while (true) {
                i++;
              }
              return i;
            `
        ).toString("base64")

        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              text: {
                name: "text",
                type: FieldType.STRING,
              },
              formula: {
                name: "formula",
                type: FieldType.FORMULA,
                formula: `{{ js "${js}"}}`,
                formulaType: FormulaType.DYNAMIC,
              },
            },
          })
        )

        await config.api.row.save(table._id!, { text: "foo" })
        const { rows } = await config.api.row.search(table._id!)
        expect(rows).toHaveLength(1)
        const row = rows[0]
        expect(row.text).toBe("foo")
        expect(row.formula).toBe("Timed out while executing JS")
      })
    })

    it("should time out JS execution if a multiple cells take too long", async () => {
      await config.withEnv(
        {
          JS_PER_INVOCATION_TIMEOUT_MS: 40,
          JS_PER_REQUEST_TIMEOUT_MS: 80,
        },
        async () => {
          const js = Buffer.from(
            `
              let i = 0;
              while (true) {
                i++;
              }
              return i;
            `
          ).toString("base64")

          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                text: {
                  name: "text",
                  type: FieldType.STRING,
                },
                formula: {
                  name: "formula",
                  type: FieldType.FORMULA,
                  formula: `{{ js "${js}"}}`,
                  formulaType: FormulaType.DYNAMIC,
                },
              },
            })
          )

          for (let i = 0; i < 10; i++) {
            await config.api.row.save(table._id!, { text: "foo" })
          }

          // Run this test 3 times to make sure that there's no cross-request
          // pollution of the execution time tracking.
          for (let reqs = 0; reqs < 3; reqs++) {
            const { rows } = await config.api.row.search(table._id!)
            expect(rows).toHaveLength(10)

            let i = 0
            for (; i < 10; i++) {
              const row = rows[i]
              if (row.formula !== "Timed out while executing JS") {
                break
              }
            }

            // Given the execution times are not deterministic, we can't be sure
            // of the exact number of rows that were executed before the timeout
            // but it should absolutely be at least 1.
            expect(i).toBeGreaterThan(0)
            expect(i).toBeLessThan(5)

            for (; i < 10; i++) {
              const row = rows[i]
              expect(row.text).toBe("foo")
              expect(row.formula).toBe("Request JS execution limit hit")
            }
          }
        }
      )
    })

    it("should not carry over context between formulas", async () => {
      const js = Buffer.from(`return $("[text]");`).toString("base64")
      const table = await config.api.table.save(
        saveTableRequest({
          schema: {
            text: {
              name: "text",
              type: FieldType.STRING,
            },
            formula: {
              name: "formula",
              type: FieldType.FORMULA,
              formula: `{{ js "${js}"}}`,
              formulaType: FormulaType.DYNAMIC,
            },
          },
        })
      )

      for (let i = 0; i < 10; i++) {
        await config.api.row.save(table._id!, { text: `foo${i}` })
      }

      const { rows } = await config.api.row.search(table._id!)
      expect(rows).toHaveLength(10)

      const formulaValues = rows.map(r => r.formula)
      expect(formulaValues).toEqual(
        expect.arrayContaining([
          "foo0",
          "foo1",
          "foo2",
          "foo3",
          "foo4",
          "foo5",
          "foo6",
          "foo7",
          "foo8",
          "foo9",
        ])
      )
    })
  })
})

// todo: remove me
