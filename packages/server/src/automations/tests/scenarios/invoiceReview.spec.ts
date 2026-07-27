import { objectStore, setEnv as setCoreEnv } from "@budibase/backend-core"
import { encodeJSBinding } from "@budibase/string-templates"
import { DocumentSourceType, SupportedFileType } from "@budibase/types"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

async function uploadTestFile(filename: string, content: string) {
  const bucket = objectStore.ObjectStoreBuckets.APPS
  await objectStore.upload({
    bucket,
    filename,
    body: Buffer.from(content),
  })
  return filename
}

describe("Invoice review automations", () => {
  const config = new TestConfiguration()
  let resetEnv: (() => void) | undefined
  let cleanupDefaultAIConfig: (() => Promise<void>) | undefined

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    resetEnv = setCoreEnv({ SELF_HOSTED: false })
    cleanupDefaultAIConfig = await setupDefaultCompletionsAIConfig(config)
    await config.publish()
  })

  afterEach(async () => {
    await cleanupDefaultAIConfig?.()
    resetEnv?.()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("extracts an invoice from an attachment and records a review row", async () => {
    const table = await config.api.table.save(basicTable())
    const filename = await uploadTestFile("invoice.png", "image-data")
    const attachment = {
      key: filename,
      name: "invoice.png",
      extension: SupportedFileType.PNG,
      size: 10,
    }

    mockChatGPTResponse(
      JSON.stringify({
        data: [
          {
            vendor: "Acme Supplies",
            total: 125.5,
            approved: true,
          },
        ],
      })
    )

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .extractFileData(
        {
          source: DocumentSourceType.ATTACHMENT,
          file: attachment,
          schema: {
            vendor: "string",
            total: "number",
            approved: "boolean",
          },
        },
        { stepName: "Extract Invoice" }
      )
      .executeScriptV2(
        {
          code: encodeJSBinding(`
            const invoice = $("steps.[Extract Invoice].data.0")
            return invoice.approved && invoice.total < 500
              ? "auto-approved"
              : "manual-review"
          `),
        },
        { stepName: "Review Decision" }
      )
      .createRow({
        row: {
          tableId: table._id,
          name: "{{ steps.[Extract Invoice].data.0.vendor }}",
          description:
            "{{ steps.[Review Decision].value }}: {{ steps.[Extract Invoice].data.0.total }}",
        },
      })
      .queryRows({ tableId: table._id! })
      .serverLog({
        text: "Invoice {{ steps.4.rows.0.name }} was {{ steps.[Review Decision].value }}",
      })
      .test({ fields: {} })

    expect(results.steps[0].outputs.data[0]).toEqual({
      vendor: "Acme Supplies",
      total: 125.5,
      approved: true,
    })
    expect(results.steps[1].outputs.value).toBe("auto-approved")
    expect(results.steps[3].outputs.rows[0]).toMatchObject({
      name: "Acme Supplies",
      description: "auto-approved: 125.5",
    })
    expect(results.steps[4].outputs.message).toContain(
      "Invoice Acme Supplies was auto-approved"
    )
  })
})
