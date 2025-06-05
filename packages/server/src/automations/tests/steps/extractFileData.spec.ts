import { basicTableWithAttachmentField } from "../../../tests/utilities/structures"
import { objectStore, setEnv as setCoreEnv } from "@budibase/backend-core"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { DocumentSourceType, SupportedFileType } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import {
  mockChatGPTResponse,
  mockOpenAIFileUpload,
} from "../../../tests/utilities/mocks/ai/openai"
async function uploadTestFile(filename: string, content?: string) {
  let bucket = objectStore.ObjectStoreBuckets.APPS
  await objectStore.upload({
    bucket,
    filename,
    body: Buffer.from(content || "test data"),
  })
  return filename
}

describe("test the extract file data action", () => {
  const config = new TestConfiguration()
  let resetEnv: () => void | undefined

  beforeEach(async () => {
    await config.init()
    await config.api.table.save(basicTableWithAttachmentField())
    await config.api.automation.deleteAll()
    resetEnv = setCoreEnv({ SELF_HOSTED: true, OPENAI_API_KEY: "abc123" })
  })

  afterEach(() => {
    resetEnv()
    jest.clearAllMocks()
    nock.cleanAll()
  })

  afterAll(() => {
    config.end()
  })

  it("should successfully extract data from a file attachment", async () => {
    mockChatGPTResponse(
      JSON.stringify({
        data: {
          name: "John Doe",
          email: "john@example.com",
        },
      })
    )

    mockOpenAIFileUpload("file-id-123")

    let filename = await uploadTestFile("test-document.pdf", "PDF content here")
    let attachmentObject = {
      key: filename,
      name: "test-document.pdf",
      extension: "application/pdf",
      size: 100,
    }

    const schema = {
      name: "string",
      email: "string",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Starting extract file data test" },
        { stepName: "StartLog" }
      )
      .extractFileData(
        {
          file: attachmentObject,
          source: DocumentSourceType.ATTACHMENT,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .serverLog(
        { text: "Extracted name: {{ stepsByName.ExtractStep.data.name }}" },
        { stepName: "NameLog" }
      )
      .test({ fields: { status: "success" } })

    expect(result.steps[1].outputs.success).toBe(true)
    expect(result.steps[1].outputs.data).toEqual({
      name: "John Doe",
      email: "john@example.com",
    })
    expect(result.steps[2].outputs.message).toContain(
      "Extracted name: John Doe"
    )
  })

  it("should successfully extract data from a URL", async () => {
    mockChatGPTResponse(
      JSON.stringify({
        data: {
          product: "Widget",
          price: 29.99,
        },
      })
    )

    mockOpenAIFileUpload("file-id-456")

    nock("https://example.com")
      .get("/test-file.pdf")
      .reply(200, "PDF content from URL", {
        "content-type": "application/pdf",
      })

    const schema = {
      product: "string",
      price: "number",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Starting URL extraction test" },
        { stepName: "StartLog" }
      )
      .extractFileData(
        {
          file: "https://example.com/test-file.pdf",
          source: DocumentSourceType.URL,
          fileType: SupportedFileType.PDF,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .serverLog(
        {
          text: "Extracted product: {{ stepsByName.ExtractStep.data.product }}",
        },
        { stepName: "ProductLog" }
      )
      .test({ fields: { status: "url-success" } })

    expect(result.steps[1].outputs.success).toBe(true)
    expect(result.steps[1].outputs.data).toEqual({
      product: "Widget",
      price: 29.99,
    })
    expect(result.steps[2].outputs.message).toContain(
      "Extracted product: Widget"
    )
  })

  it("should return error when file is missing", async () => {
    const schema = {
      name: "string",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Testing missing file" }, { stepName: "StartLog" })
      .extractFileData(
        {
          file: "",
          source: DocumentSourceType.ATTACHMENT,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .test({ fields: { status: "error" } })

    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.response).toContain(
      "File and Schema are required"
    )
  })

  it("should return error when schema is missing", async () => {
    let filename = await uploadTestFile("test-document.pdf")
    let attachmentObject = {
      key: filename,
      name: "test-document.pdf",
      extension: "pdf",
      size: 100,
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Testing missing schema" }, { stepName: "StartLog" })
      .extractFileData(
        {
          file: attachmentObject,
          source: DocumentSourceType.ATTACHMENT,
          schema: null as any,
        },
        { stepName: "ExtractStep" }
      )
      .test({ fields: { status: "error" } })

    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.response).toContain(
      "File and Schema are required"
    )
  })

  it("should handle AI service errors gracefully", async () => {
    mockOpenAIFileUpload("file-id", {
      status: 500,
      error: { error: "Internal server error" },
    })

    let filename = await uploadTestFile("test-document.pdf")
    let attachmentObject = {
      key: filename,
      name: "test-document.pdf",
      extension: "pdf",
      size: 100,
    }

    const schema = {
      name: "string",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Testing AI service error" }, { stepName: "StartLog" })
      .extractFileData(
        {
          file: attachmentObject,
          source: DocumentSourceType.ATTACHMENT,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .test({ fields: { status: "ai-error" } })

    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.response).toBeDefined()
  })

  it("should handle invalid JSON response from AI", async () => {
    mockChatGPTResponse("This is not valid JSON - should cause parsing error")
    mockOpenAIFileUpload("file-id-789")

    let filename = await uploadTestFile("test-document.pdf")
    let attachmentObject = {
      key: filename,
      name: "test-document.pdf",
      extension: "pdf",
      size: 100,
    }

    const schema = {
      name: "string",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog(
        { text: "Testing invalid JSON response" },
        { stepName: "StartLog" }
      )
      .extractFileData(
        {
          file: attachmentObject,
          source: DocumentSourceType.ATTACHMENT,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .test({ fields: { status: "json-error" } })

    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.response).toContain(
      "Could not parse AI response as valid JSON"
    )
  })

  it("should handle URL fetch errors", async () => {
    nock("https://example.com")
      .get("/non-existent-file.pdf")
      .reply(404, "Not Found")

    const schema = {
      content: "string",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Testing URL fetch error" }, { stepName: "StartLog" })
      .extractFileData(
        {
          file: "https://example.com/non-existent-file.pdf",
          source: DocumentSourceType.URL,
          fileType: SupportedFileType.PDF,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .test({ fields: { status: "url-error" } })

    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.response).toContain(
      "Failed to fetch file from URL"
    )
  })

  it("should handle source and file type mismatch", async () => {
    const schema = {
      content: "string",
    }

    const result = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({ text: "Testing source mismatch" }, { stepName: "StartLog" })
      .extractFileData(
        {
          file: "https://example.com/file.pdf",
          source: DocumentSourceType.ATTACHMENT,
          schema,
        },
        { stepName: "ExtractStep" }
      )
      .test({ fields: { status: "mismatch-error" } })

    expect(result.steps[1].outputs.success).toBe(false)
    expect(result.steps[1].outputs.response).toContain(
      "Invalid file input – source and file type do not match"
    )
  })
})
