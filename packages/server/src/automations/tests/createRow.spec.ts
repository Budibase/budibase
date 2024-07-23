import * as setup from "./utilities"
import { basicTableWithAttachmentField } from "../../tests/utilities/structures"
import { objectStore } from "@budibase/backend-core"
import { createAutomationBuilder } from "./utilities/AutomationBuilder"
import { TRIGGER_DEFINITIONS, BUILTIN_ACTION_DEFINITIONS } from "../"

async function uploadTestFile(filename: string) {
  let bucket = "testbucket"
  await objectStore.upload({
    bucket,
    filename,
    body: Buffer.from("test data"),
  })
  let presignedUrl = await objectStore.getPresignedUrl(bucket, filename, 60000)

  return presignedUrl
}
describe("test the create row action", () => {
  let table: any
  let row: any
  let config = setup.getConfig()

  beforeEach(async () => {
    await config.init()
    table = await config.createTable()
    row = {
      tableId: table._id,
      name: "test",
      description: "test",
    }
  })

  afterAll(setup.afterAll)

  it("should run trigger an automation which then creates a row", async () => {
    const table = await config.createTable()

    const builder = createAutomationBuilder(config, {
      name: "Test Row Save and Create",
    })

    const results = await builder
      .trigger(TRIGGER_DEFINITIONS.ROW_SAVED, { tableId: table._id })
      .step(BUILTIN_ACTION_DEFINITIONS.CREATE_ROW, {
        row: {
          name: "{{trigger.row.name}}",
          description: "{{trigger.row.description}}",
          tableId: table._id,
        },
      })
      .run({
        row: {
          name: "Test",
          description: "TEST",
        },
      })

    expect(results.steps).toHaveLength(1)

    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      row: {
        name: "Test",
        description: "TEST",
      },
    })
  })

  it("should be able to run the action", async () => {
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row,
    })
    expect(res.id).toBeDefined()
    expect(res.revision).toBeDefined()
    expect(res.success).toEqual(true)
    const gottenRow = await config.api.row.get(table._id, res.id)
    expect(gottenRow.name).toEqual("test")
    expect(gottenRow.description).toEqual("test")
  })

  it("should return an error (not throw) when bad info provided", async () => {
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row: {
        tableId: "invalid",
        invalid: "invalid",
      },
    })
    expect(res.success).toEqual(false)
  })

  it("should check invalid inputs return an error", async () => {
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {})
    expect(res.success).toEqual(false)
  })

  it("should check that an attachment field is sent to storage and parsed", async () => {
    let attachmentTable = await config.createTable(
      basicTableWithAttachmentField()
    )

    let attachmentRow: any = {
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
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row: attachmentRow,
    })

    expect(res.success).toEqual(true)
    expect(res.row.file_attachment[0]).toHaveProperty("key")
    let s3Key = res.row.file_attachment[0].key

    const client = objectStore.ObjectStore(objectStore.ObjectStoreBuckets.APPS)

    const objectData = await client
      .headObject({ Bucket: objectStore.ObjectStoreBuckets.APPS, Key: s3Key })
      .promise()

    expect(objectData).toBeDefined()
    expect(objectData.ContentLength).toBeGreaterThan(0)
  })

  it("should check that an single attachment field is sent to storage and parsed", async () => {
    let attachmentTable = await config.createTable(
      basicTableWithAttachmentField()
    )

    let attachmentRow: any = {
      tableId: attachmentTable._id,
    }

    let filename = "test2.txt"
    let presignedUrl = await uploadTestFile(filename)
    let attachmentObject = {
      url: presignedUrl,
      filename,
    }

    attachmentRow.single_file_attachment = attachmentObject
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row: attachmentRow,
    })

    expect(res.success).toEqual(true)
    expect(res.row.single_file_attachment).toHaveProperty("key")
    let s3Key = res.row.single_file_attachment.key

    const client = objectStore.ObjectStore(objectStore.ObjectStoreBuckets.APPS)

    const objectData = await client
      .headObject({ Bucket: objectStore.ObjectStoreBuckets.APPS, Key: s3Key })
      .promise()

    expect(objectData).toBeDefined()
    expect(objectData.ContentLength).toBeGreaterThan(0)
  })

  it("should check that attachment without the correct keys throws an error", async () => {
    let attachmentTable = await config.createTable(
      basicTableWithAttachmentField()
    )

    let attachmentRow: any = {
      tableId: attachmentTable._id,
    }

    let filename = "test2.txt"
    let presignedUrl = await uploadTestFile(filename)
    let attachmentObject = {
      wrongKey: presignedUrl,
      anotherWrongKey: filename,
    }

    attachmentRow.single_file_attachment = attachmentObject
    const res = await setup.runStep(setup.actions.CREATE_ROW.stepId, {
      row: attachmentRow,
    })

    expect(res.success).toEqual(false)
    expect(res.response).toEqual(
      'Error: Attachments must have both "url" and "filename" keys. You have provided: wrongKey, anotherWrongKey'
    )
  })
})
