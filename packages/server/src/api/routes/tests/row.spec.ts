import { databaseTestProviders } from "../../../integrations/tests/utils"

import tk from "timekeeper"
import { outputProcessing } from "../../../utilities/rowProcessor"
import * as setup from "./utilities"
import { context, InternalTable, roles, tenancy } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  AutoFieldSubTypes,
  FieldSchema,
  FieldType,
  FieldTypeSubtypes,
  MonthlyQuotaName,
  PermissionLevel,
  QuotaUsageType,
  RelationshipType,
  Row,
  SaveTableRequest,
  SearchQueryOperators,
  SortOrder,
  SortType,
  StaticQuotaName,
  Table,
} from "@budibase/types"
import {
  expectAnyExternalColsAttributes,
  expectAnyInternalColsAttributes,
  generator,
  mocks,
  structures,
} from "@budibase/backend-core/tests"
import _ from "lodash"

const timestamp = new Date("2023-01-26T11:48:57.597Z").toISOString()
tk.freeze(timestamp)

const { basicRow } = setup.structures

describe.each([
  ["internal", undefined],
  ["postgres", databaseTestProviders.postgres],
])("/rows (%s)", (__, dsProvider) => {
  const isInternal = !dsProvider

  const request = setup.getRequest()
  const config = setup.getConfig()
  let table: Table
  let tableId: string

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()

    if (dsProvider) {
      await config.createDatasource({
        datasource: await dsProvider.getDsConfig(),
      })
    }
  })

  const generateTableConfig: () => SaveTableRequest = () => {
    return {
      name: generator.word(),
      type: "table",
      primary: ["id"],
      primaryDisplay: "name",
      schema: {
        id: {
          type: FieldType.AUTO,
          name: "id",
          autocolumn: true,
          constraints: {
            presence: true,
          },
        },
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
    }
  }

  beforeEach(async () => {
    mocks.licenses.useCloudFree()
  })

  const loadRow = (id: string, tbl_Id: string, status = 200) =>
    config.api.row.get(tbl_Id, id, { expectStatus: status })

  const getRowUsage = async () => {
    const { total } = await config.doInContext(null, () =>
      quotas.getCurrentUsageValues(QuotaUsageType.STATIC, StaticQuotaName.ROWS)
    )
    return total
  }

  const getQueryUsage = async () => {
    const { total } = await config.doInContext(null, () =>
      quotas.getCurrentUsageValues(
        QuotaUsageType.MONTHLY,
        MonthlyQuotaName.QUERIES
      )
    )
    return total
  }

  const assertRowUsage = async (expected: number) => {
    const usage = await getRowUsage()
    expect(usage).toBe(expected)
  }

  const assertQueryUsage = async (expected: number) => {
    const usage = await getQueryUsage()
    expect(usage).toBe(expected)
  }

  const defaultRowFields = isInternal
    ? {
        type: "row",
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    : undefined

  beforeAll(async () => {
    const tableConfig = generateTableConfig()
    const table = await config.createTable(tableConfig)
    tableId = table._id!
  })

  describe("save, load, update", () => {
    it("returns a success message when the row is created", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .post(`/api/${tableId}/rows`)
        .send(basicRow(tableId))
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect((res as any).res.statusMessage).toEqual(
        `${config.table!.name} saved successfully`
      )
      expect(res.body.name).toEqual("Test Contact")
      expect(res.body._rev).toBeDefined()
      await assertRowUsage(rowUsage + 1)
      await assertQueryUsage(queryUsage + 1)
    })

    it("Increment row autoId per create row request", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const tableConfig = generateTableConfig()
      const newTable = await config.createTable(
        {
          ...tableConfig,
          name: "TestTableAuto",
          schema: {
            ...tableConfig.schema,
            "Row ID": {
              name: "Row ID",
              type: FieldType.NUMBER,
              subtype: AutoFieldSubTypes.AUTO_ID,
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
        },
        { skipReassigning: true }
      )

      const ids = [1, 2, 3]

      // Performing several create row requests should increment the autoID fields accordingly
      const createRow = async (id: number) => {
        const res = await config.api.row.save(newTable._id!, {
          name: "row_" + id,
        })
        expect(res.name).toEqual("row_" + id)
        expect(res._rev).toBeDefined()
        expect(res["Row ID"]).toEqual(id)
      }

      for (let i = 0; i < ids.length; i++) {
        await createRow(ids[i])
      }

      await assertRowUsage(rowUsage + ids.length)
      await assertQueryUsage(queryUsage + ids.length)
    })

    it("updates a row successfully", async () => {
      const existing = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.save(tableId, {
        _id: existing._id,
        _rev: existing._rev,
        tableId,
        name: "Updated Name",
      })

      expect(res.name).toEqual("Updated Name")
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should load a row", async () => {
      const existing = await config.createRow()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.get(tableId, existing._id!)

      expect(res.body).toEqual({
        ...existing,
        ...defaultRowFields,
      })
      await assertQueryUsage(queryUsage + 1)
    })

    it("should list all rows for given tableId", async () => {
      const table = await config.createTable(generateTableConfig(), {
        skipReassigning: true,
      })
      const tableId = table._id!
      const newRow = {
        tableId,
        name: "Second Contact",
        description: "new",
      }
      const firstRow = await config.createRow({ tableId })
      await config.createRow(newRow)
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.fetch(tableId)

      expect(res.length).toBe(2)
      expect(res.find((r: Row) => r.name === newRow.name)).toBeDefined()
      expect(res.find((r: Row) => r.name === firstRow.name)).toBeDefined()
      await assertQueryUsage(queryUsage + 1)
    })

    it("load should return 404 when row does not exist", async () => {
      await config.createRow()
      const queryUsage = await getQueryUsage()

      await config.api.row.get(tableId, "1234567", {
        expectStatus: 404,
      })
      await assertQueryUsage(queryUsage) // no change
    })

    isInternal &&
      it("row values are coerced", async () => {
        const str: FieldSchema = {
          type: FieldType.STRING,
          name: "str",
          constraints: { type: "string", presence: false },
        }
        const attachment: FieldSchema = {
          type: FieldType.ATTACHMENT,
          name: "attachment",
          constraints: { type: "array", presence: false },
        }
        const bool: FieldSchema = {
          type: FieldType.BOOLEAN,
          name: "boolean",
          constraints: { type: "boolean", presence: false },
        }
        const number: FieldSchema = {
          type: FieldType.NUMBER,
          name: "str",
          constraints: { type: "number", presence: false },
        }
        const datetime: FieldSchema = {
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
        const table = await config.createTable({
          name: "TestTable2",
          type: "table",
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
            attachmentNull: attachment,
            attachmentUndefined: attachment,
            attachmentEmpty: attachment,
            attachmentEmptyArrayStr: attachment,
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

        const row = {
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
          datetimeString: "1984-04-20T00:00:00.000Z",
          datetimeDate: new Date("1984-04-20"),
          boolNull: null,
          boolEmpty: "",
          boolUndefined: undefined,
          boolString: "true",
          boolBool: true,
          tableId: table._id,
          attachmentNull: null,
          attachmentUndefined: undefined,
          attachmentEmpty: "",
          attachmentEmptyArrayStr: "[]",
          arrayFieldEmptyArrayStr: "[]",
          arrayFieldUndefined: undefined,
          arrayFieldNull: null,
          arrayFieldArrayStrKnown: "['One']",
          optsFieldEmptyStr: "",
          optsFieldUndefined: undefined,
          optsFieldNull: null,
          optsFieldStrKnown: "Alpha",
        }

        const createdRow = await config.createRow(row)
        const id = createdRow._id!

        const saved = (await loadRow(id, table._id!)).body

        expect(saved.stringUndefined).toBe(undefined)
        expect(saved.stringNull).toBe("")
        expect(saved.stringString).toBe("i am a string")
        expect(saved.numberEmptyString).toBe(null)
        expect(saved.numberNull).toBe(null)
        expect(saved.numberUndefined).toBe(undefined)
        expect(saved.numberString).toBe(123)
        expect(saved.numberNumber).toBe(123)
        expect(saved.datetimeEmptyString).toBe(null)
        expect(saved.datetimeNull).toBe(null)
        expect(saved.datetimeUndefined).toBe(undefined)
        expect(saved.datetimeString).toBe(
          new Date(row.datetimeString).toISOString()
        )
        expect(saved.datetimeDate).toBe(row.datetimeDate.toISOString())
        expect(saved.boolNull).toBe(null)
        expect(saved.boolEmpty).toBe(null)
        expect(saved.boolUndefined).toBe(undefined)
        expect(saved.boolString).toBe(true)
        expect(saved.boolBool).toBe(true)
        expect(saved.attachmentNull).toEqual([])
        expect(saved.attachmentUndefined).toBe(undefined)
        expect(saved.attachmentEmpty).toEqual([])
        expect(saved.attachmentEmptyArrayStr).toEqual([])
        expect(saved.arrayFieldEmptyArrayStr).toEqual([])
        expect(saved.arrayFieldNull).toEqual([])
        expect(saved.arrayFieldUndefined).toEqual(undefined)
        expect(saved.optsFieldEmptyStr).toEqual(null)
        expect(saved.optsFieldUndefined).toEqual(undefined)
        expect(saved.optsFieldNull).toEqual(null)
        expect(saved.arrayFieldArrayStrKnown).toEqual(["One"])
        expect(saved.optsFieldStrKnown).toEqual("Alpha")
      })
  })

  describe("view save", () => {
    it("views have extra data trimmed", async () => {
      const table = await config.createTable({
        name: "orders",
        primary: ["OrderID"],
        schema: {
          Country: {
            type: FieldType.STRING,
            name: "Country",
          },
          OrderID: {
            type: FieldType.NUMBER,
            name: "OrderID",
          },
          Story: {
            type: FieldType.STRING,
            name: "Story",
          },
        },
      })

      const createViewResponse = await config.createView({
        name: generator.word(),
        schema: {
          Country: {
            visible: true,
          },
          OrderID: {
            visible: true,
          },
        },
      })

      const createRowResponse = await config.api.row.save(
        createViewResponse.id,
        {
          OrderID: "1111",
          Country: "Aussy",
          Story: "aaaaa",
        }
      )

      const row = await config.api.row.get(table._id!, createRowResponse._id!)
      expect(row.body.Story).toBeUndefined()
      expect(row.body).toEqual({
        ...defaultRowFields,
        OrderID: 1111,
        Country: "Aussy",
        _id: createRowResponse._id,
        _rev: createRowResponse._rev,
        tableId: table._id,
      })
    })
  })

  describe("patch", () => {
    beforeAll(async () => {
      const tableConfig = generateTableConfig()
      table = await config.createTable(tableConfig)
    })

    it("should update only the fields that are supplied", async () => {
      const existing = await config.createRow()

      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.patch(table._id!, {
        _id: existing._id!,
        _rev: existing._rev!,
        tableId: table._id!,
        name: "Updated Name",
      })

      expect((res as any).res.statusMessage).toEqual(
        `${table.name} updated successfully.`
      )
      expect(res.body.name).toEqual("Updated Name")
      expect(res.body.description).toEqual(existing.description)

      const savedRow = await loadRow(res.body._id, table._id!)

      expect(savedRow.body.description).toEqual(existing.description)
      expect(savedRow.body.name).toEqual("Updated Name")
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 2) // account for the second load
    })

    it("should throw an error when given improper types", async () => {
      const existing = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      await config.api.row.patch(
        table._id!,
        {
          _id: existing._id!,
          _rev: existing._rev!,
          tableId: table._id!,
          name: 1,
        },
        { expectStatus: 400 }
      )

      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })
  })

  describe("destroy", () => {
    beforeAll(async () => {
      const tableConfig = generateTableConfig()
      table = await config.createTable(tableConfig)
    })

    it("should be able to delete a row", async () => {
      const createdRow = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.delete(table._id!, [createdRow])
      expect(res.body[0]._id).toEqual(createdRow._id)
      await assertRowUsage(rowUsage - 1)
      await assertQueryUsage(queryUsage + 1)
    })
  })

  describe("validate", () => {
    beforeAll(async () => {
      const tableConfig = generateTableConfig()
      table = await config.createTable(tableConfig)
    })

    it("should return no errors on valid row", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.validate(table._id!, { name: "ivan" })

      expect(res.valid).toBe(true)
      expect(Object.keys(res.errors)).toEqual([])
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })

    it("should errors on invalid row", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

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
      await assertQueryUsage(queryUsage)
    })
  })

  describe("bulkDelete", () => {
    beforeAll(async () => {
      const tableConfig = generateTableConfig()
      table = await config.createTable(tableConfig)
    })

    it("should be able to delete a bulk set of rows", async () => {
      const row1 = await config.createRow()
      const row2 = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.delete(table._id!, [row1, row2])

      expect(res.body.length).toEqual(2)
      await loadRow(row1._id!, table._id!, 404)
      await assertRowUsage(rowUsage - 2)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should be able to delete a variety of row set types", async () => {
      const [row1, row2, row3] = await Promise.all([
        config.createRow(),
        config.createRow(),
        config.createRow(),
      ])
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.delete(table._id!, [
        row1,
        row2._id,
        { _id: row3._id },
      ])

      expect(res.body.length).toEqual(3)
      await loadRow(row1._id!, table._id!, 404)
      await assertRowUsage(rowUsage - 3)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should accept a valid row object and delete the row", async () => {
      const row1 = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.delete(table._id!, row1)

      expect(res.body.id).toEqual(row1._id)
      await loadRow(row1._id!, table._id!, 404)
      await assertRowUsage(rowUsage - 1)
      await assertQueryUsage(queryUsage + 1)
    })

    it("Should ignore malformed/invalid delete requests", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await config.api.row.delete(
        table._id!,
        { not: "valid" },
        { expectStatus: 400 }
      )
      expect(res.body.message).toEqual("Invalid delete rows request")

      const res2 = await config.api.row.delete(
        table._id!,
        { rows: 123 },
        { expectStatus: 400 }
      )
      expect(res2.body.message).toEqual("Invalid delete rows request")

      const res3 = await config.api.row.delete(table._id!, "invalid", {
        expectStatus: 400,
      })
      expect(res3.body.message).toEqual("Invalid delete rows request")

      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })
  })

  // Legacy views are not available for external
  isInternal &&
    describe("fetchView", () => {
      beforeEach(async () => {
        const tableConfig = generateTableConfig()
        table = await config.createTable(tableConfig)
      })

      it("should be able to fetch tables contents via 'view'", async () => {
        const row = await config.createRow()
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        const res = await config.api.legacyView.get(table._id!)
        expect(res.body.length).toEqual(1)
        expect(res.body[0]._id).toEqual(row._id)
        await assertRowUsage(rowUsage)
        await assertQueryUsage(queryUsage + 1)
      })

      it("should throw an error if view doesn't exist", async () => {
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        await config.api.legacyView.get("derp", { expectStatus: 404 })

        await assertRowUsage(rowUsage)
        await assertQueryUsage(queryUsage)
      })

      it("should be able to run on a view", async () => {
        const view = await config.createLegacyView({
          tableId: table._id!,
          name: "ViewTest",
          filters: [],
          schema: {},
        })
        const row = await config.createRow()
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        const res = await config.api.legacyView.get(view.name)
        expect(res.body.length).toEqual(1)
        expect(res.body[0]._id).toEqual(row._id)

        await assertRowUsage(rowUsage)
        await assertQueryUsage(queryUsage + 1)
      })
    })

  describe("fetchEnrichedRows", () => {
    beforeAll(async () => {
      const tableConfig = generateTableConfig()
      table = await config.createTable(tableConfig)
    })

    it("should allow enriching some linked rows", async () => {
      const { linkedTable, firstRow, secondRow } = await tenancy.doInTenant(
        config.getTenantId(),
        async () => {
          const linkedTable = await config.createLinkedTable(
            RelationshipType.ONE_TO_MANY,
            ["link"],
            {
              name: generator.word(),
              type: "table",
              primary: ["id"],
              primaryDisplay: "id",
              schema: {
                id: {
                  type: FieldType.AUTO,
                  name: "id",
                  autocolumn: true,
                  constraints: {
                    presence: true,
                  },
                },
              },
            }
          )
          const firstRow = await config.createRow({
            name: "Test Contact",
            description: "original description",
            tableId: table._id,
          })
          const secondRow = await config.createRow({
            name: "Test 2",
            description: "og desc",
            link: [{ _id: firstRow._id }],
            tableId: linkedTable._id,
          })
          return { linkedTable, firstRow, secondRow }
        }
      )
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      // test basic enrichment
      const resBasic = await config.api.row.get(
        linkedTable._id!,
        secondRow._id!
      )
      expect(resBasic.body.link.length).toBe(1)
      expect(resBasic.body.link[0]).toEqual({
        _id: firstRow._id,
        primaryDisplay: firstRow.name,
      })

      // test full enrichment
      const resEnriched = await config.api.row.getEnriched(
        linkedTable._id!,
        secondRow._id!
      )
      expect(resEnriched.body.link.length).toBe(1)
      expect(resEnriched.body.link[0]._id).toBe(firstRow._id)
      expect(resEnriched.body.link[0].name).toBe("Test Contact")
      expect(resEnriched.body.link[0].description).toBe("original description")
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 2)
    })
  })

  isInternal &&
    describe("attachments", () => {
      beforeAll(async () => {
        const tableConfig = generateTableConfig()
        table = await config.createTable(tableConfig)
      })

      it("should allow enriching attachment rows", async () => {
        const table = await config.createAttachmentTable()
        const attachmentId = `${structures.uuid()}.csv`
        const row = await config.createRow({
          name: "test",
          description: "test",
          attachment: [
            {
              key: `${config.getAppId()}/attachments/${attachmentId}`,
            },
          ],
          tableId: table._id,
        })
        // the environment needs configured for this
        await setup.switchToSelfHosted(async () => {
          return context.doInAppContext(config.getAppId(), async () => {
            const enriched = await outputProcessing(table, [row])
            expect((enriched as Row[])[0].attachment[0].url).toBe(
              `/files/signed/prod-budi-app-assets/${config.getProdAppId()}/attachments/${attachmentId}`
            )
          })
        })
      })
    })

  describe("exportData", () => {
    beforeAll(async () => {
      const tableConfig = generateTableConfig()
      table = await config.createTable(tableConfig)
    })

    it("should allow exporting all columns", async () => {
      const existing = await config.createRow()
      const res = await config.api.row.exportRows(table._id!, {
        rows: [existing._id!],
      })
      const results = JSON.parse(res.text)
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
      const existing = await config.createRow()
      const res = await config.api.row.exportRows(table._id!, {
        rows: [existing._id!],
        columns: ["_id"],
      })
      const results = JSON.parse(res.text)
      expect(results.length).toEqual(1)
      const row = results[0]

      // Ensure only the _id column was exported
      expect(Object.keys(row).length).toEqual(1)
      expect(row._id).toEqual(existing._id)
    })
  })

  describe("view 2.0", () => {
    async function userTable(): Promise<Table> {
      return {
        name: `users_${generator.word()}`,
        type: "table",
        primary: ["id"],
        schema: {
          id: {
            type: FieldType.AUTO,
            name: "id",
            autocolumn: true,
            constraints: {
              presence: true,
            },
          },
          name: {
            type: FieldType.STRING,
            name: "name",
          },
          surname: {
            type: FieldType.STRING,
            name: "surname",
          },
          age: {
            type: FieldType.NUMBER,
            name: "age",
          },
          address: {
            type: FieldType.STRING,
            name: "address",
          },
          jobTitle: {
            type: FieldType.STRING,
            name: "jobTitle",
          },
        },
      }
    }

    const randomRowData = () => ({
      name: generator.first(),
      surname: generator.last(),
      age: generator.age(),
      address: generator.address(),
      jobTitle: generator.word(),
    })

    describe("create", () => {
      it("should persist a new row with only the provided view fields", async () => {
        const table = await config.createTable(await userTable())
        const view = await config.createView({
          schema: {
            name: { visible: true },
            surname: { visible: true },
            address: { visible: true },
          },
        })

        const data = randomRowData()
        const newRow = await config.api.row.save(view.id, {
          tableId: table!._id,
          _viewId: view.id,
          ...data,
        })

        const row = await config.api.row.get(table._id!, newRow._id!)
        expect(row.body).toEqual({
          name: data.name,
          surname: data.surname,
          address: data.address,
          tableId: table!._id,
          _id: newRow._id,
          _rev: newRow._rev,
          id: newRow.id,
          ...defaultRowFields,
        })
        expect(row.body._viewId).toBeUndefined()
        expect(row.body.age).toBeUndefined()
        expect(row.body.jobTitle).toBeUndefined()
      })
    })

    describe("patch", () => {
      it("should update only the view fields for a row", async () => {
        const table = await config.createTable(await userTable())
        const tableId = table._id!
        const view = await config.createView({
          schema: {
            name: { visible: true },
            address: { visible: true },
          },
        })

        const newRow = await config.api.row.save(view.id, {
          tableId,
          _viewId: view.id,
          ...randomRowData(),
        })
        const newData = randomRowData()
        await config.api.row.patch(view.id, {
          tableId,
          _viewId: view.id,
          _id: newRow._id!,
          _rev: newRow._rev!,
          ...newData,
        })

        const row = await config.api.row.get(tableId, newRow._id!)
        expect(row.body).toEqual({
          ...newRow,
          name: newData.name,
          address: newData.address,
          _id: newRow._id,
          _rev: expect.any(String),
          id: newRow.id,
          ...defaultRowFields,
        })
        expect(row.body._viewId).toBeUndefined()
        expect(row.body.age).toBeUndefined()
        expect(row.body.jobTitle).toBeUndefined()
      })
    })

    describe("destroy", () => {
      it("should be able to delete a row", async () => {
        const table = await config.createTable(await userTable())
        const tableId = table._id!
        const view = await config.createView({
          schema: {
            name: { visible: true },
            address: { visible: true },
          },
        })

        const createdRow = await config.createRow()
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        await config.api.row.delete(view.id, [createdRow])

        await assertRowUsage(rowUsage - 1)
        await assertQueryUsage(queryUsage + 1)

        await config.api.row.get(tableId, createdRow._id!, {
          expectStatus: 404,
        })
      })

      it("should be able to delete multiple rows", async () => {
        const table = await config.createTable(await userTable())
        const tableId = table._id!
        const view = await config.createView({
          schema: {
            name: { visible: true },
            address: { visible: true },
          },
        })

        const rows = await Promise.all([
          config.createRow(),
          config.createRow(),
          config.createRow(),
        ])
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        await config.api.row.delete(view.id, [rows[0], rows[2]])

        await assertRowUsage(rowUsage - 2)
        await assertQueryUsage(queryUsage + 1)

        await config.api.row.get(tableId, rows[0]._id!, {
          expectStatus: 404,
        })
        await config.api.row.get(tableId, rows[2]._id!, {
          expectStatus: 404,
        })
        await config.api.row.get(tableId, rows[1]._id!, { expectStatus: 200 })
      })
    })

    describe("view search", () => {
      const viewSchema = { age: { visible: true }, name: { visible: true } }
      async function userTable(): Promise<Table> {
        return {
          name: `users_${generator.word()}`,
          type: "table",
          primary: ["id"],
          schema: {
            id: {
              type: FieldType.AUTO,
              name: "id",
              autocolumn: true,
              constraints: {
                presence: true,
              },
            },
            name: {
              type: FieldType.STRING,
              name: "name",
              constraints: { type: "string" },
            },
            age: {
              type: FieldType.NUMBER,
              name: "age",
              constraints: {},
            },
          },
        }
      }

      it("returns empty rows from view when no schema is passed", async () => {
        const table = await config.createTable(await userTable())
        const rows = await Promise.all(
          Array.from({ length: 10 }, () =>
            config.api.row.save(table._id!, { tableId: table._id })
          )
        )

        const createViewResponse = await config.createView()
        const response = await config.api.viewV2.search(createViewResponse.id)

        expect(response.body.rows).toHaveLength(10)
        expect(response.body).toEqual({
          rows: expect.arrayContaining(
            rows.map(r => ({
              _viewId: createViewResponse.id,
              tableId: table._id,
              _id: r._id,
              _rev: r._rev,
              ...defaultRowFields,
            }))
          ),
          ...(isInternal
            ? {}
            : {
                hasNextPage: false,
                bookmark: null,
              }),
        })
      })

      it("searching respects the view filters", async () => {
        const table = await config.createTable(await userTable())

        await Promise.all(
          Array.from({ length: 10 }, () =>
            config.api.row.save(table._id!, {
              tableId: table._id,
              name: generator.name(),
              age: generator.integer({ min: 10, max: 30 }),
            })
          )
        )

        const expectedRows = await Promise.all(
          Array.from({ length: 5 }, () =>
            config.api.row.save(table._id!, {
              tableId: table._id,
              name: generator.name(),
              age: 40,
            })
          )
        )

        const createViewResponse = await config.createView({
          query: [
            { operator: SearchQueryOperators.EQUAL, field: "age", value: 40 },
          ],
          schema: viewSchema,
        })

        const response = await config.api.viewV2.search(createViewResponse.id)

        expect(response.body.rows).toHaveLength(5)
        expect(response.body).toEqual({
          rows: expect.arrayContaining(
            expectedRows.map(r => ({
              _viewId: createViewResponse.id,
              tableId: table._id,
              name: r.name,
              age: r.age,
              _id: r._id,
              _rev: r._rev,
              ...defaultRowFields,
            }))
          ),
          ...(isInternal
            ? {}
            : {
                hasNextPage: false,
                bookmark: null,
              }),
        })
      })

      const sortTestOptions: [
        {
          field: string
          order?: SortOrder
          type?: SortType
        },
        string[]
      ][] = [
        [
          {
            field: "name",
            order: SortOrder.ASCENDING,
            type: SortType.STRING,
          },
          ["Alice", "Bob", "Charly", "Danny"],
        ],
        [
          {
            field: "name",
          },
          ["Alice", "Bob", "Charly", "Danny"],
        ],
        [
          {
            field: "name",
            order: SortOrder.DESCENDING,
          },
          ["Danny", "Charly", "Bob", "Alice"],
        ],
        [
          {
            field: "name",
            order: SortOrder.DESCENDING,
            type: SortType.STRING,
          },
          ["Danny", "Charly", "Bob", "Alice"],
        ],
        [
          {
            field: "age",
            order: SortOrder.ASCENDING,
            type: SortType.number,
          },
          ["Danny", "Alice", "Charly", "Bob"],
        ],
        [
          {
            field: "age",
            order: SortOrder.ASCENDING,
          },
          ["Danny", "Alice", "Charly", "Bob"],
        ],
        [
          {
            field: "age",
            order: SortOrder.DESCENDING,
          },
          ["Bob", "Charly", "Alice", "Danny"],
        ],
        [
          {
            field: "age",
            order: SortOrder.DESCENDING,
            type: SortType.number,
          },
          ["Bob", "Charly", "Alice", "Danny"],
        ],
      ]

      describe("sorting", () => {
        beforeAll(async () => {
          const table = await config.createTable(await userTable())
          const users = [
            { name: "Alice", age: 25 },
            { name: "Bob", age: 30 },
            { name: "Charly", age: 27 },
            { name: "Danny", age: 15 },
          ]
          await Promise.all(
            users.map(u =>
              config.api.row.save(table._id!, {
                tableId: table._id,
                ...u,
              })
            )
          )
        })

        it.each(sortTestOptions)(
          "allow sorting (%s)",
          async (sortParams, expected) => {
            const createViewResponse = await config.createView({
              sort: sortParams,
              schema: viewSchema,
            })

            const response = await config.api.viewV2.search(
              createViewResponse.id
            )

            expect(response.body.rows).toHaveLength(4)
            expect(response.body.rows).toEqual(
              expected.map(name => expect.objectContaining({ name }))
            )
          }
        )

        it.each(sortTestOptions)(
          "allow override the default view sorting (%s)",
          async (sortParams, expected) => {
            const createViewResponse = await config.createView({
              sort: {
                field: "name",
                order: SortOrder.ASCENDING,
                type: SortType.STRING,
              },
              schema: viewSchema,
            })

            const response = await config.api.viewV2.search(
              createViewResponse.id,
              {
                sort: sortParams.field,
                sortOrder: sortParams.order,
                sortType: sortParams.type,
                query: {},
              }
            )

            expect(response.body.rows).toHaveLength(4)
            expect(response.body.rows).toEqual(
              expected.map(name => expect.objectContaining({ name }))
            )
          }
        )
      })

      it("when schema is defined, defined columns and row attributes are returned", async () => {
        const table = await config.createTable(await userTable())
        const rows = await Promise.all(
          Array.from({ length: 10 }, () =>
            config.api.row.save(table._id!, {
              tableId: table._id,
              name: generator.name(),
              age: generator.age(),
            })
          )
        )

        const view = await config.createView({
          schema: { name: { visible: true } },
        })
        const response = await config.api.viewV2.search(view.id)

        expect(response.body.rows).toHaveLength(10)
        expect(response.body.rows).toEqual(
          expect.arrayContaining(
            rows.map(r => ({
              ...(isInternal
                ? expectAnyInternalColsAttributes
                : expectAnyExternalColsAttributes),
              _viewId: view.id,
              name: r.name,
            }))
          )
        )
      })

      it("views without data can be returned", async () => {
        const table = await config.createTable(await userTable())

        const createViewResponse = await config.createView()
        const response = await config.api.viewV2.search(createViewResponse.id)

        expect(response.body.rows).toHaveLength(0)
      })

      it("respects the limit parameter", async () => {
        await config.createTable(await userTable())
        await Promise.all(Array.from({ length: 10 }, () => config.createRow()))

        const limit = generator.integer({ min: 1, max: 8 })

        const createViewResponse = await config.createView()
        const response = await config.api.viewV2.search(createViewResponse.id, {
          limit,
          query: {},
        })

        expect(response.body.rows).toHaveLength(limit)
      })

      it("can handle pagination", async () => {
        await config.createTable(await userTable())
        await Promise.all(Array.from({ length: 10 }, () => config.createRow()))

        const createViewResponse = await config.createView()
        const allRows = (await config.api.viewV2.search(createViewResponse.id))
          .body.rows

        const firstPageResponse = await config.api.viewV2.search(
          createViewResponse.id,
          {
            paginate: true,
            limit: 4,
            query: {},
          }
        )
        expect(firstPageResponse.body).toEqual({
          rows: expect.arrayContaining(allRows.slice(0, 4)),
          totalRows: isInternal ? 10 : undefined,
          hasNextPage: true,
          bookmark: expect.anything(),
        })

        const secondPageResponse = await config.api.viewV2.search(
          createViewResponse.id,
          {
            paginate: true,
            limit: 4,
            bookmark: firstPageResponse.body.bookmark,

            query: {},
          }
        )
        expect(secondPageResponse.body).toEqual({
          rows: expect.arrayContaining(allRows.slice(4, 8)),
          totalRows: isInternal ? 10 : undefined,
          hasNextPage: true,
          bookmark: expect.anything(),
        })

        const lastPageResponse = await config.api.viewV2.search(
          createViewResponse.id,
          {
            paginate: true,
            limit: 4,
            bookmark: secondPageResponse.body.bookmark,
            query: {},
          }
        )
        expect(lastPageResponse.body).toEqual({
          rows: expect.arrayContaining(allRows.slice(8)),
          totalRows: isInternal ? 10 : undefined,
          hasNextPage: false,
          bookmark: expect.anything(),
        })
      })

      isInternal &&
        it("doesn't allow creating in user table", async () => {
          const userTableId = InternalTable.USER_METADATA
          const response = await config.api.row.save(
            userTableId,
            {
              tableId: userTableId,
              firstName: "Joe",
              lastName: "Joe",
              email: "joe@joe.com",
              roles: {},
            },
            { expectStatus: 400 }
          )
          expect(response.message).toBe("Cannot create new user entry.")
        })

      describe("permissions", () => {
        let viewId: string
        let tableId: string

        beforeAll(async () => {
          await config.createTable(await userTable())
          await Promise.all(
            Array.from({ length: 10 }, () => config.createRow())
          )

          const createViewResponse = await config.createView()

          tableId = table._id!
          viewId = createViewResponse.id
        })

        beforeEach(() => {
          mocks.licenses.useViewPermissions()
        })

        it("does not allow public users to fetch by default", async () => {
          await config.publish()
          await config.api.viewV2.search(viewId, undefined, {
            expectStatus: 403,
            usePublicUser: true,
          })
        })

        it("allow public users to fetch when permissions are explicit", async () => {
          await config.api.permission.set({
            roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
            level: PermissionLevel.READ,
            resourceId: viewId,
          })
          await config.publish()

          const response = await config.api.viewV2.search(viewId, undefined, {
            usePublicUser: true,
          })

          expect(response.body.rows).toHaveLength(10)
        })

        it("allow public users to fetch when permissions are inherited", async () => {
          await config.api.permission.set({
            roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
            level: PermissionLevel.READ,
            resourceId: tableId,
          })
          await config.publish()

          const response = await config.api.viewV2.search(viewId, undefined, {
            usePublicUser: true,
          })

          expect(response.body.rows).toHaveLength(10)
        })

        it("respects inherited permissions, not allowing not public views from public tables", async () => {
          await config.api.permission.set({
            roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
            level: PermissionLevel.READ,
            resourceId: tableId,
          })
          await config.api.permission.set({
            roleId: roles.BUILTIN_ROLE_IDS.POWER,
            level: PermissionLevel.READ,
            resourceId: viewId,
          })
          await config.publish()

          await config.api.viewV2.search(viewId, undefined, {
            usePublicUser: true,
            expectStatus: 403,
          })
        })
      })
    })
  })

  let o2mTable: Table
  let m2mTable: Table
  beforeAll(async () => {
    o2mTable = await config.createTable(
      { ...generateTableConfig(), name: "o2m" },
      {
        skipReassigning: true,
      }
    )
    m2mTable = await config.createTable(
      { ...generateTableConfig(), name: "m2m" },
      {
        skipReassigning: true,
      }
    )
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
          name: generator.word(),
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
          subtype: FieldTypeSubtypes.BB_REFERENCE.USER,
        },
        users: {
          name: "users",
          type: FieldType.BB_REFERENCE,
          subtype: FieldTypeSubtypes.BB_REFERENCE.USERS,
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
      const tableConfig = generateTableConfig()

      if (config.datasource) {
        tableConfig.sourceId = config.datasource._id
        if (config.datasource.plus) {
          tableConfig.type = "external"
        }
      }
      const table = await config.api.table.create({
        ...tableConfig,
        schema: {
          ...tableConfig.schema,
          ...relSchema(),
        },
      })
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
      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
      }
      const row = await config.api.row.save(tableId, rowData)

      expect(row).toEqual({
        name: rowData.name,
        description: rowData.description,
        tableId,
        _id: expect.any(String),
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
      })
    })

    it("can save a row with a single relationship field", async () => {
      const user = _.sample(o2mData)!
      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
        user: [user],
      }
      const row = await config.api.row.save(tableId, rowData)

      expect(row).toEqual({
        name: rowData.name,
        description: rowData.description,
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
      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
        users: selectedUsers,
      }
      const row = await config.api.row.save(tableId, rowData)

      expect(row).toEqual({
        name: rowData.name,
        description: rowData.description,
        tableId,
        users: expect.arrayContaining(selectedUsers.map(u => resultMapper(u))),
        _id: expect.any(String),
        _rev: expect.any(String),
        id: isInternal ? undefined : expect.any(Number),
        type: isInternal ? "row" : undefined,
      })
    })

    it("can retrieve rows with no populated relationships", async () => {
      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
      }
      const row = await config.api.row.save(tableId, rowData)

      const { body: retrieved } = await config.api.row.get(tableId, row._id!)
      expect(retrieved).toEqual({
        name: rowData.name,
        description: rowData.description,
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

      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
        users: [user2, user3],
        user: [user1],
      }
      const row = await config.api.row.save(tableId, rowData)

      const { body: retrieved } = await config.api.row.get(tableId, row._id!)
      expect(retrieved).toEqual({
        name: rowData.name,
        description: rowData.description,
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

      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
        users: [users1, users2],
      }
      const row = await config.api.row.save(tableId, rowData)

      const updatedRow = await config.api.row.save(tableId, {
        ...row,
        user: [user],
        users: [users3, users1],
      })
      expect(updatedRow).toEqual({
        name: rowData.name,
        description: rowData.description,
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

      const rowData = {
        ...basicRow(tableId),
        name: generator.name(),
        description: generator.name(),
        users: [user1, user2],
      }
      const row = await config.api.row.save(tableId, rowData)

      const updatedRow = await config.api.row.save(tableId, {
        ...row,
        user: null,
        users: null,
      })
      expect(updatedRow).toEqual({
        name: rowData.name,
        description: rowData.description,
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

      const rows: {
        name: string
        description: string
        user?: Row[]
        users?: Row[]
        tableId: string
      }[] = [
        {
          ...basicRow(tableId),
          name: generator.name(),
          description: generator.name(),
          users: [users1, users2],
        },
        {
          ...basicRow(tableId),
          name: generator.name(),
          description: generator.name(),
          user: [user1],
          users: [users1, users3],
        },
        {
          ...basicRow(tableId),
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

      const rows: {
        name: string
        description: string
        user?: Row[]
        users?: Row[]
        tableId: string
      }[] = [
        {
          ...basicRow(tableId),
          name: generator.name(),
          description: generator.name(),
          users: [users1, users2],
        },
        {
          ...basicRow(tableId),
          name: generator.name(),
          description: generator.name(),
          user: [user1],
          users: [users1, users3],
        },
        {
          ...basicRow(tableId),
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
              bookmark: null,
            }),
      })
    })
  })
})
