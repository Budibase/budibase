import * as automation from "../../index"
import * as setup from "../utilities"
import { LoopStepType, FieldType, Table } from "@budibase/types"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { DatabaseName } from "../../../integrations/tests/utils"
import { objectStore } from "@budibase/backend-core"
import { basicTableWithAttachmentField } from "../../../tests/utilities/structures"

describe("Automation Scenarios", () => {
  let config = setup.getConfig()

  beforeEach(async () => {
    await automation.init()
    await config.init()
  })

  afterAll(setup.afterAll)

  describe("Row Automations", () => {
    it("should trigger an automation which then creates a row", async () => {
      const table = await config.createTable()

      const builder = createAutomationBuilder({
        name: "Test Row Save and Create",
      })

      const results = await builder
        .rowUpdated(
          { tableId: table._id! },
          {
            row: { name: "Test", description: "TEST" },
            id: "1234",
          }
        )
        .createRow({
          row: {
            name: "{{trigger.row.name}}",
            description: "{{trigger.row.description}}",
            tableId: table._id,
          },
        })
        .run()

      expect(results.steps).toHaveLength(1)

      expect(results.steps[0].outputs).toMatchObject({
        success: true,
        row: {
          name: "Test",
          description: "TEST",
        },
      })
    })

    it("should trigger an automation which querys the database", async () => {
      const table = await config.createTable()
      const row = {
        name: "Test Row",
        description: "original description",
        tableId: table._id,
      }
      await config.createRow(row)
      await config.createRow(row)
      const builder = createAutomationBuilder({
        name: "Test Row Save and Create",
      })

      const results = await builder
        .appAction({ fields: {} })
        .queryRows({
          tableId: table._id!,
        })
        .run()

      expect(results.steps).toHaveLength(1)
      expect(results.steps[0].outputs.rows).toHaveLength(2)
    })

    it("should trigger an automation which querys the database then deletes a row", async () => {
      const table = await config.createTable()
      const row = {
        name: "DFN",
        description: "original description",
        tableId: table._id,
      }
      await config.createRow(row)
      await config.createRow(row)
      const builder = createAutomationBuilder({
        name: "Test Row Save and Create",
      })

      const results = await builder
        .appAction({ fields: {} })
        .queryRows({
          tableId: table._id!,
        })
        .deleteRow({
          tableId: table._id!,
          id: "{{ steps.1.rows.0._id }}",
        })
        .queryRows({
          tableId: table._id!,
        })
        .run()

      expect(results.steps).toHaveLength(3)
      expect(results.steps[1].outputs.success).toBeTruthy()
      expect(results.steps[2].outputs.rows).toHaveLength(1)
    })

    it("should query an external database for some data then insert than into an internal table", async () => {
      const { datasource, client } = await setup.setupTestDatasource(
        config,
        DatabaseName.MYSQL
      )

      const newTable = await config.createTable({
        name: "table",
        type: "table",
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          age: {
            name: "age",
            type: FieldType.NUMBER,
            constraints: {
              presence: true,
            },
          },
        },
      })

      const tableName = await setup.createTestTable(client, {
        name: { type: "string" },
        age: { type: "number" },
      })

      const rows = [
        { name: "Joe", age: 20 },
        { name: "Bob", age: 25 },
        { name: "Paul", age: 30 },
      ]

      await setup.insertTestData(client, tableName, rows)

      const query = await setup.saveTestQuery(
        config,
        client,
        tableName,
        datasource
      )

      const builder = createAutomationBuilder({
        name: "Test external query and save",
      })

      const results = await builder
        .appAction({
          fields: {},
        })
        .executeQuery({
          query: {
            queryId: query._id!,
          },
        })
        .loop({
          option: LoopStepType.ARRAY,
          binding: "{{ steps.1.response }}",
        })
        .createRow({
          row: {
            name: "{{ loop.currentItem.name }}",
            age: "{{ loop.currentItem.age }}",
            tableId: newTable._id!,
          },
        })
        .queryRows({
          tableId: newTable._id!,
        })
        .run()

      expect(results.steps).toHaveLength(3)

      expect(results.steps[1].outputs.iterations).toBe(3)
      expect(results.steps[1].outputs.items).toHaveLength(3)

      expect(results.steps[2].outputs.rows).toHaveLength(3)

      rows.forEach(expectedRow => {
        expect(results.steps[2].outputs.rows).toEqual(
          expect.arrayContaining([expect.objectContaining(expectedRow)])
        )
      })
    })

    it("should trigger an automation which creates and then updates a row", async () => {
      const table = await config.createTable({
        name: "TestTable",
        type: "table",
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          value: {
            name: "value",
            type: FieldType.NUMBER,
            constraints: {
              presence: true,
            },
          },
        },
      })

      const builder = createAutomationBuilder({
        name: "Test Create and Update Row",
      })

      const results = await builder
        .appAction({ fields: {} })
        .createRow(
          {
            row: {
              name: "Initial Row",
              value: 1,
              tableId: table._id,
            },
          },
          { stepName: "CreateRowStep" }
        )
        .updateRow(
          {
            rowId: "{{ steps.CreateRowStep.row._id }}",
            row: {
              name: "Updated Row",
              value: 2,
              tableId: table._id,
            },
            meta: {},
          },
          { stepName: "UpdateRowStep" }
        )
        .queryRows(
          {
            tableId: table._id!,
          },
          { stepName: "QueryRowsStep" }
        )
        .run()

      expect(results.steps).toHaveLength(3)

      expect(results.steps[0].outputs).toMatchObject({
        success: true,
        row: {
          name: "Initial Row",
          value: 1,
        },
      })

      expect(results.steps[1].outputs).toMatchObject({
        success: true,
        row: {
          name: "Updated Row",
          value: 2,
        },
      })

      const expectedRows = [{ name: "Updated Row", value: 2 }]

      expect(results.steps[2].outputs.rows).toEqual(
        expect.arrayContaining(
          expectedRows.map(row => expect.objectContaining(row))
        )
      )
    })
  })

  describe("Name Based Automations", () => {
    it("should fetch and delete a row using automation naming", async () => {
      const table = await config.createTable()
      const row = {
        name: "DFN",
        description: "original description",
        tableId: table._id,
      }
      await config.createRow(row)
      await config.createRow(row)
      const builder = createAutomationBuilder({
        name: "Test Query and Delete Row",
      })

      const results = await builder
        .appAction({ fields: {} })
        .queryRows(
          {
            tableId: table._id!,
          },
          { stepName: "InitialQueryStep" }
        )
        .deleteRow({
          tableId: table._id!,
          id: "{{ steps.InitialQueryStep.rows.0._id }}",
        })
        .queryRows({
          tableId: table._id!,
        })
        .run()

      expect(results.steps).toHaveLength(3)
      expect(results.steps[1].outputs.success).toBeTruthy()
      expect(results.steps[2].outputs.rows).toHaveLength(1)
    })
  })

  describe("Attachment Automations", () => {
    async function uploadTestFile(filename: string) {
      let bucket = "testbucket"
      await objectStore.upload({
        bucket,
        filename,
        body: Buffer.from("test data"),
      })
      let presignedUrl = await objectStore.getPresignedUrl(
        bucket,
        filename,
        60000
      )
      return presignedUrl
    }

    it("should check that an attachment field is sent to storage and parsed", async () => {
      const table = await config.createTable(basicTableWithAttachmentField())
      const filename = "test1.txt"
      const presignedUrl = await uploadTestFile(filename)
      const attachmentObject = [{ url: presignedUrl, filename }]

      const builder = createAutomationBuilder({
        name: "Test Attachment Field",
      })

      const results = await builder
        .appAction({ fields: {} })
        .createRow({
          row: {
            tableId: table._id,
            file_attachment: attachmentObject,
          },
        })
        .queryRows({
          tableId: table._id!,
        })
        .run()

      expect(results.steps[0].outputs.success).toEqual(true)
      expect(results.steps[0].outputs.row.file_attachment[0]).toHaveProperty(
        "key"
      )
      const s3Key = results.steps[0].outputs.row.file_attachment[0].key

      const client = objectStore.ObjectStore(
        objectStore.ObjectStoreBuckets.APPS
      )
      const objectData = await client
        .headObject({ Bucket: objectStore.ObjectStoreBuckets.APPS, Key: s3Key })
        .promise()

      expect(objectData).toBeDefined()
      expect(objectData.ContentLength).toBeGreaterThan(0)
    })

    it("should check that a single attachment field is sent to storage and parsed", async () => {
      const table = await config.createTable(basicTableWithAttachmentField())
      const filename = "test2.txt"
      const presignedUrl = await uploadTestFile(filename)
      const attachmentObject = { url: presignedUrl, filename }

      const builder = createAutomationBuilder({
        name: "Test Single Attachment Field",
      })

      const results = await builder
        .appAction({ fields: {} })
        .createRow({
          row: {
            tableId: table._id,
            single_file_attachment: attachmentObject,
          },
        })
        .run()

      expect(results.steps[0].outputs.success).toEqual(true)
      expect(
        results.steps[0].outputs.row.single_file_attachment
      ).toHaveProperty("key")
      const s3Key = results.steps[0].outputs.row.single_file_attachment.key

      const client = objectStore.ObjectStore(
        objectStore.ObjectStoreBuckets.APPS
      )
      const objectData = await client
        .headObject({ Bucket: objectStore.ObjectStoreBuckets.APPS, Key: s3Key })
        .promise()

      expect(objectData).toBeDefined()
      expect(objectData.ContentLength).toBeGreaterThan(0)
    })

    it("should check that attachment without the correct keys throws an error", async () => {
      const table = await config.createTable(basicTableWithAttachmentField())
      const filename = "test2.txt"
      const presignedUrl = await uploadTestFile(filename)
      const attachmentObject = {
        wrongKey: presignedUrl,
        anotherWrongKey: filename,
      }

      const builder = createAutomationBuilder({
        name: "Test Invalid Attachment Keys",
      })

      const results = await builder
        .appAction({ fields: {} })
        .createRow({
          row: {
            tableId: table._id,
            single_file_attachment: attachmentObject,
          },
        })
        .run()

      expect(results.steps[0].outputs.success).toEqual(false)
      expect(results.steps[0].outputs.response).toEqual(
        'Error: Attachments must have both "url" and "filename" keys. You have provided: wrongKey, anotherWrongKey'
      )
    })
  })
})
