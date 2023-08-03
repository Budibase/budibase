import tk from "timekeeper"
const timestamp = new Date("2023-01-26T11:48:57.597Z").toISOString()
tk.freeze(timestamp)

import { outputProcessing } from "../../../utilities/rowProcessor"
import * as setup from "./utilities"
const { basicRow } = setup.structures
import { context, tenancy } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  QuotaUsageType,
  StaticQuotaName,
  MonthlyQuotaName,
  Row,
  Table,
  FieldType,
  SortType,
  SortOrder,
  DeleteRow,
} from "@budibase/types"
import {
  expectAnyInternalColsAttributes,
  generator,
  structures,
} from "@budibase/backend-core/tests"
import trimViewRowInfoMiddleware from "../../../middleware/trimViewRowInfo"
import noViewDataMiddleware from "../../../middleware/noViewData"
import router from "../row"

describe("/rows", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let table: Table
  let row: Row

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    table = await config.createTable()
    row = basicRow(table._id!)
  })

  const loadRow = async (id: string, tbl_Id: string, status = 200) =>
    await request
      .get(`/api/${tbl_Id}/rows/${id}`)
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(status)

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

  describe("save, load, update", () => {
    it("returns a success message when the row is created", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .post(`/api/${row.tableId}/rows`)
        .send(row)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect((res as any).res.statusMessage).toEqual(
        `${table.name} saved successfully`
      )
      expect(res.body.name).toEqual("Test Contact")
      expect(res.body._rev).toBeDefined()
      await assertRowUsage(rowUsage + 1)
      await assertQueryUsage(queryUsage + 1)
    })

    it("Increment row autoId per create row request", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const newTable = await config.createTable({
        name: "TestTableAuto",
        type: "table",
        schema: {
          ...table.schema,
          "Row ID": {
            name: "Row ID",
            type: FieldType.NUMBER,
            subtype: "autoID",
            icon: "ri-magic-line",
            autocolumn: true,
            constraints: {
              type: "number",
              presence: false,
              numericality: {
                greaterThanOrEqualTo: "",
                lessThanOrEqualTo: "",
              },
            },
          },
        },
      })

      const ids = [1, 2, 3]

      // Performing several create row requests should increment the autoID fields accordingly
      const createRow = async (id: number) => {
        const res = await request
          .post(`/api/${newTable._id}/rows`)
          .send({
            name: "row_" + id,
          })
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect((res as any).res.statusMessage).toEqual(
          `${newTable.name} saved successfully`
        )
        expect(res.body.name).toEqual("row_" + id)
        expect(res.body._rev).toBeDefined()
        expect(res.body["Row ID"]).toEqual(id)
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

      const res = await request
        .post(`/api/${table._id}/rows`)
        .send({
          _id: existing._id,
          _rev: existing._rev,
          tableId: table._id,
          name: "Updated Name",
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect((res as any).res.statusMessage).toEqual(
        `${table.name} updated successfully.`
      )
      expect(res.body.name).toEqual("Updated Name")
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should load a row", async () => {
      const existing = await config.createRow()
      const queryUsage = await getQueryUsage()

      const res = await request
        .get(`/api/${table._id}/rows/${existing._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toEqual({
        ...row,
        _id: existing._id,
        _rev: existing._rev,
        type: "row",
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      await assertQueryUsage(queryUsage + 1)
    })

    it("should list all rows for given tableId", async () => {
      const newRow = {
        tableId: table._id,
        name: "Second Contact",
        status: "new",
      }
      await config.createRow()
      await config.createRow(newRow)
      const queryUsage = await getQueryUsage()

      const res = await request
        .get(`/api/${table._id}/rows`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toBe(2)
      expect(res.body.find((r: Row) => r.name === newRow.name)).toBeDefined()
      expect(res.body.find((r: Row) => r.name === row.name)).toBeDefined()
      await assertQueryUsage(queryUsage + 1)
    })

    it("load should return 404 when row does not exist", async () => {
      await config.createRow()
      const queryUsage = await getQueryUsage()

      await request
        .get(`/api/${table._id}/rows/not-a-valid-id`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(404)
      await assertQueryUsage(queryUsage) // no change
    })

    it("row values are coerced", async () => {
      const str = {
        type: FieldType.STRING,
        name: "str",
        constraints: { type: "string", presence: false },
      }
      const attachment = {
        type: FieldType.ATTACHMENT,
        name: "attachment",
        constraints: { type: "array", presence: false },
      }
      const bool = {
        type: FieldType.BOOLEAN,
        name: "boolean",
        constraints: { type: "boolean", presence: false },
      }
      const number = {
        type: FieldType.NUMBER,
        name: "str",
        constraints: { type: "number", presence: false },
      }
      const datetime = {
        type: FieldType.DATETIME,
        name: "datetime",
        constraints: {
          type: "string",
          presence: false,
          datetime: { earliest: "", latest: "" },
        },
      }
      const arrayField = {
        type: FieldType.ARRAY,
        constraints: {
          type: "array",
          presence: false,
          inclusion: ["One", "Two", "Three"],
        },
        name: "Sample Tags",
        sortable: false,
      }
      const optsField = {
          fieldName: "Sample Opts",
          name: "Sample Opts",
          type: FieldType.OPTIONS,
          constraints: {
            type: "string",
            presence: false,
            inclusion: ["Alpha", "Beta", "Gamma"],
          },
        },
        table = await config.createTable({
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

      row = {
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

    it("should throw an error when creating a table row with view id data", async () => {
      const res = await request
        .post(`/api/${row.tableId}/rows`)
        .send({ ...row, _viewId: generator.guid() })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)
      expect(res.body.message).toEqual(
        "Table row endpoints cannot contain view info"
      )
    })

    it("should setup the noViewData middleware", async () => {
      const route = router.stack.find(
        r => r.methods.includes("POST") && r.path === "/api/:tableId/rows"
      )
      expect(route).toBeDefined()
      expect(route?.stack).toContainEqual(noViewDataMiddleware)
    })
  })

  describe("patch", () => {
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

    it("should throw an error when creating a table row with view id data", async () => {
      const existing = await config.createRow()

      const res = await config.api.row.patch(
        table._id!,
        {
          ...existing,
          _id: existing._id!,
          _rev: existing._rev!,
          tableId: table._id!,
          _viewId: generator.guid(),
        },
        { expectStatus: 400 }
      )
      expect(res.body.message).toEqual(
        "Table row endpoints cannot contain view info"
      )
    })

    it("should setup the noViewData middleware", async () => {
      const route = router.stack.find(
        r => r.methods.includes("PATCH") && r.path === "/api/:tableId/rows"
      )
      expect(route).toBeDefined()
      expect(route?.stack).toContainEqual(noViewDataMiddleware)
    })
  })

  describe("destroy", () => {
    it("should be able to delete a row", async () => {
      const createdRow = await config.createRow(row)
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .delete(`/api/${table._id}/rows`)
        .send({
          rows: [createdRow],
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body[0]._id).toEqual(createdRow._id)
      await assertRowUsage(rowUsage - 1)
      await assertQueryUsage(queryUsage + 1)
    })
  })

  describe("validate", () => {
    it("should return no errors on valid row", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .post(`/api/${table._id}/rows/validate`)
        .send({ name: "ivan" })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.valid).toBe(true)
      expect(Object.keys(res.body.errors)).toEqual([])
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })

    it("should errors on invalid row", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .post(`/api/${table._id}/rows/validate`)
        .send({ name: 1 })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.valid).toBe(false)
      expect(Object.keys(res.body.errors)).toEqual(["name"])
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })
  })

  describe("bulkDelete", () => {
    it("should be able to delete a bulk set of rows", async () => {
      const row1 = await config.createRow()
      const row2 = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .delete(`/api/${table._id}/rows`)
        .send({
          rows: [row1, row2],
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toEqual(2)
      await loadRow(row1._id!, table._id!, 404)
      await assertRowUsage(rowUsage - 2)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should be able to delete a variety of row set types", async () => {
      const row1 = await config.createRow()
      const row2 = await config.createRow()
      const row3 = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .delete(`/api/${table._id}/rows`)
        .send({
          rows: [row1, row2._id, { _id: row3._id }],
        })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toEqual(3)
      await loadRow(row1._id!, table._id!, 404)
      await assertRowUsage(rowUsage - 3)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should accept a valid row object and delete the row", async () => {
      const row1 = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .delete(`/api/${table._id}/rows`)
        .send(row1)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.id).toEqual(row1._id)
      await loadRow(row1._id!, table._id!, 404)
      await assertRowUsage(rowUsage - 1)
      await assertQueryUsage(queryUsage + 1)
    })

    it("Should ignore malformed/invalid delete requests", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .delete(`/api/${table._id}/rows`)
        .send({ not: "valid" })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res.body.message).toEqual("Invalid delete rows request")

      const res2 = await request
        .delete(`/api/${table._id}/rows`)
        .send({ rows: 123 })
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res2.body.message).toEqual("Invalid delete rows request")

      const res3 = await request
        .delete(`/api/${table._id}/rows`)
        .send("invalid")
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(res3.body.message).toEqual("Invalid delete rows request")

      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })
  })

  describe("fetchView", () => {
    it("should be able to fetch tables contents via 'view'", async () => {
      const row = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .get(`/api/views/${table._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]._id).toEqual(row._id)
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 1)
    })

    it("should throw an error if view doesn't exist", async () => {
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      await request
        .get(`/api/views/derp`)
        .set(config.defaultHeaders())
        .expect(404)

      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage)
    })

    it("should be able to run on a view", async () => {
      const view = await config.createView()
      const row = await config.createRow()
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      const res = await request
        .get(`/api/views/${view.name}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(res.body.length).toEqual(1)
      expect(res.body[0]._id).toEqual(row._id)

      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 1)
    })
  })

  describe("fetchEnrichedRows", () => {
    it("should allow enriching some linked rows", async () => {
      const { table, firstRow, secondRow } = await tenancy.doInTenant(
        config.getTenantId(),
        async () => {
          const table = await config.createLinkedTable()
          const firstRow = await config.createRow({
            name: "Test Contact",
            description: "original description",
            tableId: table._id,
          })
          const secondRow = await config.createRow({
            name: "Test 2",
            description: "og desc",
            link: [{ _id: firstRow._id }],
            tableId: table._id,
          })
          return { table, firstRow, secondRow }
        }
      )
      const rowUsage = await getRowUsage()
      const queryUsage = await getQueryUsage()

      // test basic enrichment
      const resBasic = await request
        .get(`/api/${table._id}/rows/${secondRow._id}`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(resBasic.body.link[0]._id).toBe(firstRow._id)
      expect(resBasic.body.link[0].primaryDisplay).toBe("Test Contact")

      // test full enrichment
      const resEnriched = await request
        .get(`/api/${table._id}/${secondRow._id}/enrich`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      expect(resEnriched.body.link.length).toBe(1)
      expect(resEnriched.body.link[0]._id).toBe(firstRow._id)
      expect(resEnriched.body.link[0].name).toBe("Test Contact")
      expect(resEnriched.body.link[0].description).toBe("original description")
      await assertRowUsage(rowUsage)
      await assertQueryUsage(queryUsage + 2)
    })
  })

  describe("attachments", () => {
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
        context.doInAppContext(config.getAppId(), async () => {
          const enriched = await outputProcessing(table, [row])
          expect((enriched as Row[])[0].attachment[0].url).toBe(
            `/files/signed/prod-budi-app-assets/${config.getProdAppId()}/attachments/${attachmentId}`
          )
        })
      })
    })
  })

  describe("exportData", () => {
    it("should allow exporting all columns", async () => {
      const existing = await config.createRow()
      const res = await request
        .post(`/api/${table._id}/rows/exportRows?format=json`)
        .set(config.defaultHeaders())
        .send({
          rows: [existing._id],
        })
        .expect("Content-Type", /json/)
        .expect(200)
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
      const res = await request
        .post(`/api/${table._id}/rows/exportRows?format=json`)
        .set(config.defaultHeaders())
        .send({
          rows: [existing._id],
          columns: ["_id"],
        })
        .expect("Content-Type", /json/)
        .expect(200)
      const results = JSON.parse(res.text)
      expect(results.length).toEqual(1)
      const row = results[0]

      // Ensure only the _id column was exported
      expect(Object.keys(row).length).toEqual(1)
      expect(row._id).toEqual(existing._id)
    })
  })

  describe("view 2.0", () => {
    function userTable(): Table {
      return {
        name: "user",
        type: "user",
        schema: {
          name: {
            type: FieldType.STRING,
            name: "name",
          },
          surname: {
            type: FieldType.STRING,
            name: "name",
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
        const table = await config.createTable(userTable())
        const view = await config.api.viewV2.create({
          tableId: table._id!,
          schema: {
            name: { visible: true },
            surname: { visible: true },
            address: { visible: true },
          },
        })

        const data = randomRowData()
        const newRow = await config.api.viewV2.row.create(view.id, {
          tableId: config.table!._id,
          _viewId: view.id,
          ...data,
        })

        const row = await config.api.row.get(table._id!, newRow._id!)
        expect(row.body).toEqual({
          name: data.name,
          surname: data.surname,
          address: data.address,
          tableId: config.table!._id,
          type: "row",
          _id: expect.any(String),
          _rev: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
        expect(row.body._viewId).toBeUndefined()
        expect(row.body.age).toBeUndefined()
        expect(row.body.jobTitle).toBeUndefined()
      })

      it("should setup the trimViewRowInfo middleware", async () => {
        const route = router.stack.find(
          r =>
            r.methods.includes("POST") &&
            r.path === "/api/v2/views/:viewId/rows"
        )
        expect(route).toBeDefined()
        expect(route?.stack).toContainEqual(trimViewRowInfoMiddleware)
      })
    })

    describe("patch", () => {
      it("should update only the view fields for a row", async () => {
        const table = await config.createTable(userTable())
        const tableId = table._id!
        const view = await config.api.viewV2.create({
          tableId,
          schema: {
            name: { visible: true },
            address: { visible: true },
          },
        })

        const newRow = await config.api.viewV2.row.create(view.id, {
          tableId,
          _viewId: view.id,
          ...randomRowData(),
        })
        const newData = randomRowData()
        await config.api.viewV2.row.update(view.id, newRow._id!, {
          tableId,
          _viewId: view.id,
          _id: newRow._id!,
          _rev: newRow._rev!,
          ...newData,
        })

        const row = await config.api.row.get(tableId, newRow._id!)
        expect(row.body).toEqual({
          ...newRow,
          type: "row",
          name: newData.name,
          address: newData.address,
          _id: expect.any(String),
          _rev: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
        expect(row.body._viewId).toBeUndefined()
        expect(row.body.age).toBeUndefined()
        expect(row.body.jobTitle).toBeUndefined()
      })

      it("should setup the trimViewRowInfo middleware", async () => {
        const route = router.stack.find(
          r =>
            r.methods.includes("PATCH") &&
            r.path === "/api/v2/views/:viewId/rows/:rowId"
        )
        expect(route).toBeDefined()
        expect(route?.stack).toContainEqual(trimViewRowInfoMiddleware)
      })
    })

    describe("destroy", () => {
      it("should be able to delete a row", async () => {
        const table = await config.createTable(userTable())
        const tableId = table._id!
        const view = await config.api.viewV2.create({
          tableId,
          schema: {
            name: { visible: true },
            address: { visible: true },
          },
        })

        const createdRow = await config.createRow()
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        const body: DeleteRow = {
          _id: createdRow._id!,
        }
        await config.api.viewV2.row.delete(view.id, body)

        await assertRowUsage(rowUsage - 1)
        await assertQueryUsage(queryUsage + 1)

        await config.api.row.get(tableId, createdRow._id!, {
          expectStatus: 404,
        })
      })

      it("should be able to delete multiple rows", async () => {
        const table = await config.createTable(userTable())
        const tableId = table._id!
        const view = await config.api.viewV2.create({
          tableId,
          schema: {
            name: { visible: true },
            address: { visible: true },
          },
        })

        const rows = [
          await config.createRow(),
          await config.createRow(),
          await config.createRow(),
        ]
        const rowUsage = await getRowUsage()
        const queryUsage = await getQueryUsage()

        await config.api.viewV2.row.delete(view.id, {
          rows: [rows[0], rows[2]],
        })

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
      function userTable(): Table {
        return {
          name: "user",
          type: "user",
          schema: {
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

      it("returns table rows from view", async () => {
        const table = await config.createTable(userTable())
        const rows = []
        for (let i = 0; i < 10; i++) {
          rows.push(await config.createRow({ tableId: table._id }))
        }

        const createViewResponse = await config.api.viewV2.create()
        const response = await config.api.viewV2.search(createViewResponse.id)

        expect(response.body.rows).toHaveLength(10)
        expect(response.body).toEqual({
          rows: expect.arrayContaining(rows.map(expect.objectContaining)),
        })
      })

      it("searching respects the view filters", async () => {
        const table = await config.createTable(userTable())
        const expectedRows = []
        for (let i = 0; i < 10; i++)
          await config.createRow({
            tableId: table._id,
            name: generator.name(),
            age: generator.integer({ min: 10, max: 30 }),
          })

        for (let i = 0; i < 5; i++)
          expectedRows.push(
            await config.createRow({
              tableId: table._id,
              name: generator.name(),
              age: 40,
            })
          )

        const createViewResponse = await config.api.viewV2.create({
          query: { equal: { age: 40 } },
        })

        const response = await config.api.viewV2.search(createViewResponse.id)

        expect(response.body.rows).toHaveLength(5)
        expect(response.body).toEqual({
          rows: expect.arrayContaining(
            expectedRows.map(expect.objectContaining)
          ),
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

      it.each(sortTestOptions)(
        "allow sorting (%s)",
        async (sortParams, expected) => {
          await config.createTable(userTable())
          const users = [
            { name: "Alice", age: 25 },
            { name: "Bob", age: 30 },
            { name: "Charly", age: 27 },
            { name: "Danny", age: 15 },
          ]
          for (const user of users) {
            await config.createRow({
              tableId: config.table!._id,
              ...user,
            })
          }

          const createViewResponse = await config.api.viewV2.create({
            sort: sortParams,
          })

          const response = await config.api.viewV2.search(createViewResponse.id)

          expect(response.body.rows).toHaveLength(4)
          expect(response.body).toEqual({
            rows: expected.map(name => expect.objectContaining({ name })),
          })
        }
      )

      it.each(sortTestOptions)(
        "allow override the default view sorting (%s)",
        async (sortParams, expected) => {
          await config.createTable(userTable())
          const users = [
            { name: "Alice", age: 25 },
            { name: "Bob", age: 30 },
            { name: "Charly", age: 27 },
            { name: "Danny", age: 15 },
          ]
          for (const user of users) {
            await config.createRow({
              tableId: config.table!._id,
              ...user,
            })
          }

          const createViewResponse = await config.api.viewV2.create({
            sort: {
              field: "name",
              order: SortOrder.ASCENDING,
              type: SortType.STRING,
            },
          })

          const response = await config.api.viewV2.search(
            createViewResponse.id,
            {
              sort: sortParams.field,
              sortOrder: sortParams.order,
              sortType: sortParams.type,
            }
          )

          expect(response.body.rows).toHaveLength(4)
          expect(response.body).toEqual({
            rows: expected.map(name => expect.objectContaining({ name })),
          })
        }
      )

      it("when schema is defined, defined columns and row attributes are returned", async () => {
        const table = await config.createTable(userTable())
        const rows = []
        for (let i = 0; i < 10; i++) {
          rows.push(
            await config.createRow({
              tableId: table._id,
              name: generator.name(),
              age: generator.age(),
            })
          )
        }

        const view = await config.api.viewV2.create({
          schema: { name: {} },
        })
        const response = await config.api.viewV2.search(view.id)

        expect(response.body.rows).toHaveLength(10)
        expect(response.body.rows).toEqual(
          expect.arrayContaining(
            rows.map(r => ({
              ...expectAnyInternalColsAttributes,
              _viewId: view.id,
              name: r.name,
            }))
          )
        )
      })

      it("views without data can be returned", async () => {
        const table = await config.createTable(userTable())

        const createViewResponse = await config.api.viewV2.create()
        const response = await config.api.viewV2.search(createViewResponse.id)

        expect(response.body.rows).toHaveLength(0)
      })
    })
  })
})
