import {
  basicTable,
  basicTableWithAttachmentField,
} from "../../../tests/utilities/structures"
import { objectStore } from "@budibase/backend-core"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { FilterCondition, Row, Table } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

async function uploadTestFile(filename: string) {
  let bucket = "testbucket"
  await objectStore.upload({
    bucket,
    filename,
    body: Buffer.from("test data"),
  })
  let presignedUrl = objectStore.getPresignedUrl(bucket, filename, 60000)

  return presignedUrl
}

describe("test the create row action", () => {
  const config = new TestConfiguration()

  let table: Table
  let row: Row

  beforeEach(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
    row = {
      tableId: table._id,
      name: "test",
      description: "test",
    }
    await config.api.automation.deleteAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should be able to run the action", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Starting create row flow" }, { stepName: "StartLog" })
      .createRow({ row }, { stepName: "CreateRow" })
      .serverLog(
        { text: "Row created with ID: {{ stepsByName.CreateRow.row._id }}" },
        { stepName: "CreationLog" }
      )
      .test({ fields: { status: "new" } })

    expect(result.steps[1].outputs.success).toBeDefined()
    expect(result.steps[1].outputs.id).toBeDefined()
    expect(result.steps[1].outputs.revision).toBeDefined()

    const gottenRow = await config.api.row.get(
      table._id!,
      result.steps[1].outputs.id
    )
    expect(gottenRow.name).toEqual("test")
    expect(gottenRow.description).toEqual("test")
    expect(result.steps[2].outputs.message).toContain(
      "Row created with ID: " + result.steps[1].outputs.id
    )
  })

  it("should return an error (not throw) when bad info provided", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Starting error test flow" }, { stepName: "StartLog" })
      .createRow(
        {
          row: {
            tableId: "invalid",
            invalid: "invalid",
          },
        },
        { stepName: "CreateRow" }
      )
      .test({ fields: { status: "error" } })

    expect(result.steps[1].outputs.success).toEqual(false)
  })

  it("should check invalid inputs return an error", async () => {
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Testing invalid input" }, { stepName: "StartLog" })
      .createRow({ row: {} }, { stepName: "CreateRow" })
      .filter({
        field: "{{ stepsByName.CreateRow.success }}",
        condition: FilterCondition.EQUAL,
        value: true,
      })
      .serverLog(
        { text: "This log should not appear" },
        { stepName: "SkippedLog" }
      )
      .test({ fields: { status: "invalid" } })

    expect(result.steps[1].outputs.success).toEqual(false)
    expect(result.steps.length).toBeLessThan(4)
  })

  it("should check that an attachment field is sent to storage and parsed", async () => {
    let attachmentTable = await config.api.table.save(
      basicTableWithAttachmentField()
    )

    let attachmentRow: Row = {
      tableId: attachmentTable._id,
    }

    let filename = "test1.txt"
    let presignedUrl = await uploadTestFile(filename)
    let attachmentObject = [
      {
        url: presignedUrl,
        filename,
      },
    ]

    attachmentRow.file_attachment = attachmentObject
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Processing attachment upload" },
        { stepName: "StartLog" }
      )
      .createRow({ row: attachmentRow }, { stepName: "CreateRow" })
      .filter({
        field: "{{ stepsByName.CreateRow.success }}",
        condition: FilterCondition.EQUAL,
        value: true,
      })
      .serverLog(
        {
          text: "Attachment uploaded with key: {{ stepsByName.CreateRow.row.file_attachment.0.key }}",
        },
        { stepName: "UploadLog" }
      )
      .test({ fields: { type: "attachment" } })

    expect(result.steps[1].outputs.success).toEqual(true)
    expect(result.steps[1].outputs.row.file_attachment[0]).toHaveProperty("key")
    let s3Key = result.steps[1].outputs.row.file_attachment[0].key

    const client = objectStore.ObjectStore()

    const objectData = await client.headObject({
      Bucket: objectStore.ObjectStoreBuckets.APPS,
      Key: s3Key,
    })

    expect(objectData).toBeDefined()
    expect(objectData.ContentLength).toBeGreaterThan(0)
  })

  it("should check that an single attachment field is sent to storage and parsed", async () => {
    let attachmentTable = await config.api.table.save(
      basicTableWithAttachmentField()
    )

    let attachmentRow: Row = {
      tableId: attachmentTable._id,
    }

    let filename = "test2.txt"
    let presignedUrl = await uploadTestFile(filename)
    let attachmentObject = {
      url: presignedUrl,
      filename,
    }

    attachmentRow.single_file_attachment = attachmentObject
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Processing single attachment" },
        { stepName: "StartLog" }
      )
      .createRow({ row: attachmentRow }, { stepName: "CreateRow" })
      .branch({
        success: {
          steps: stepBuilder =>
            stepBuilder
              .serverLog(
                { text: "Single attachment processed" },
                { stepName: "ProcessLog" }
              )
              .serverLog(
                {
                  text: "File key: {{ stepsByName.CreateRow.row.single_file_attachment.key }}",
                },
                { stepName: "KeyLog" }
              ),
          condition: {
            equal: { "{{ stepsByName.CreateRow.success }}": true },
          },
        },
        error: {
          steps: stepBuilder =>
            stepBuilder.serverLog(
              { text: "Failed to process attachment" },
              { stepName: "ErrorLog" }
            ),
          condition: {
            equal: { "{{ stepsByName.CreateRow.success }}": false },
          },
        },
      })
      .test({ fields: { type: "single-attachment" } })

    expect(result.steps[1].outputs.success).toEqual(true)
    expect(result.steps[1].outputs.row.single_file_attachment).toHaveProperty(
      "key"
    )
    let s3Key = result.steps[1].outputs.row.single_file_attachment.key

    const client = objectStore.ObjectStore()

    const objectData = await client.headObject({
      Bucket: objectStore.ObjectStoreBuckets.APPS,
      Key: s3Key,
    })

    expect(objectData).toBeDefined()
    expect(objectData.ContentLength).toBeGreaterThan(0)
  })

  it("should check that attachment without the correct keys throws an error", async () => {
    let attachmentTable = await config.api.table.save(
      basicTableWithAttachmentField()
    )

    let attachmentRow: Row = {
      tableId: attachmentTable._id,
    }

    let filename = "test2.txt"
    let presignedUrl = await uploadTestFile(filename)
    let attachmentObject = {
      wrongKey: presignedUrl,
      anotherWrongKey: filename,
    }

    attachmentRow.single_file_attachment = attachmentObject
    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Testing invalid attachment keys" },
        { stepName: "StartLog" }
      )
      .createRow({ row: attachmentRow }, { stepName: "CreateRow" })
      .branch({
        success: {
          steps: stepBuilder =>
            stepBuilder.serverLog(
              { text: "Unexpected success" },
              { stepName: "UnexpectedLog" }
            ),
          condition: {
            equal: { "{{ stepsByName.CreateRow.success }}": true },
          },
        },
        error: {
          steps: stepBuilder =>
            stepBuilder
              .serverLog(
                { text: "Expected error occurred" },
                { stepName: "ErrorLog" }
              )
              .serverLog(
                { text: "Error: {{ stepsByName.CreateRow.response }}" },
                { stepName: "ErrorDetailsLog" }
              ),
          condition: {
            equal: { "{{ stepsByName.CreateRow.success }}": false },
          },
        },
      })
      .test({ fields: { type: "invalid-attachment" } })

    expect(result.steps[1].outputs.success).toEqual(false)
    expect(result.steps[1].outputs.response).toEqual(
      'Error: Attachments must have both "url" and "filename" keys. You have provided: wrongKey, anotherWrongKey'
    )
    expect(result.steps[2].outputs.status).toEqual("No branch condition met")
  })
})
