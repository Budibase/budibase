import { DocumentSourceType, SupportedFileType } from "@budibase/types"
import { MockLanguageModelV3 } from "ai/test"
import sdk from "../../../sdk"
import { PDFParse } from "pdf-parse"
import { Readable } from "stream"
import { run } from "./extract"
import { fetchWithBlacklist } from "../utils"

jest.mock("pdf-parse", () => ({
  PDFParse: jest.fn(),
}))

jest.mock("../../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      llm: {
        getDefaultLLMOrThrow: jest.fn(),
      },
    },
  },
}))

jest.mock("../utils", () => ({
  fetchWithBlacklist: jest.fn(),
}))
const createExtractMockLanguageModel = (data: unknown[]) =>
  new MockLanguageModelV3({
    doGenerate: async () => ({
      content: [{ type: "text" as const, text: JSON.stringify({ data }) }],
      finishReason: { unified: "stop" as const, raw: undefined },
      usage: {
        inputTokens: {
          total: 10,
          noCache: 10,
          cacheRead: undefined,
          cacheWrite: undefined,
        },
        outputTokens: {
          total: 20,
          text: 20,
          reasoning: undefined,
        },
      },
      warnings: [],
    }),
  })

describe("extract file data step unit tests", () => {
  const getDefaultLLMMock = sdk.ai.llm
    .getDefaultLLMOrThrow as jest.MockedFunction<
    typeof sdk.ai.llm.getDefaultLLMOrThrow
  >
  const fetchWithBlacklistMock = fetchWithBlacklist as jest.MockedFunction<
    typeof fetchWithBlacklist
  >
  const PDFParseMock = PDFParse as jest.MockedClass<typeof PDFParse>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("streams pdf uploads and avoids buffering when upload succeeds", async () => {
    const fileStream = Readable.from(Buffer.from("fake pdf bytes"))
    const bufferMock = jest.fn()
    const uploadFile = jest.fn().mockResolvedValue("file-123")
    const chatModel = createExtractMockLanguageModel([
      { invoiceNumber: "INV-1" },
    ])

    fetchWithBlacklistMock.mockResolvedValue({
      ok: true,
      body: fileStream,
      buffer: bufferMock,
    } as any)

    getDefaultLLMMock.mockResolvedValue({
      chat: chatModel,
      providerOptions: undefined,
      uploadFile,
    })

    const result = await run({
      inputs: {
        source: DocumentSourceType.URL,
        file: "https://example.com/invoice.pdf",
        fileType: SupportedFileType.PDF,
        schema: { invoiceNumber: "string" },
      },
    })

    expect(result.success).toBe(true)
    expect(uploadFile).toHaveBeenCalledWith(
      fileStream,
      "document.pdf",
      SupportedFileType.PDF
    )
    expect(bufferMock).not.toHaveBeenCalled()
    expect(chatModel.doGenerateCalls).toHaveLength(1)
    expect(chatModel.doGenerateCalls[0].prompt).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          content: expect.arrayContaining([
            expect.objectContaining({
              type: "file",
              data: "file-123",
              mediaType: "application/pdf",
            }),
          ]),
        }),
      ])
    )
  })

  it("falls back to inline pdf text when llm.uploadFile is unavailable", async () => {
    fetchWithBlacklistMock.mockResolvedValue({
      ok: true,
      buffer: jest.fn().mockResolvedValue(Buffer.from("fake pdf bytes")),
    } as any)

    PDFParseMock.mockImplementation(
      () =>
        ({
          getText: jest
            .fn()
            .mockResolvedValue({ text: "invoice number INV-1" }),
        }) as any
    )

    const chatModel = createExtractMockLanguageModel([
      { invoiceNumber: "INV-1" },
    ])

    getDefaultLLMMock.mockResolvedValue({
      chat: chatModel,
      providerOptions: undefined,
      uploadFile: jest
        .fn()
        .mockRejectedValue(new Error("This model doesn't support create_file")),
    })

    const result = await run({
      inputs: {
        source: DocumentSourceType.URL,
        file: "https://example.com/invoice.pdf",
        fileType: SupportedFileType.PDF,
        schema: { invoiceNumber: "string" },
      },
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual([{ invoiceNumber: "INV-1" }])
    expect(chatModel.doGenerateCalls).toHaveLength(1)
    expect(chatModel.doGenerateCalls[0].prompt).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          content: expect.arrayContaining([
            expect.objectContaining({
              type: "text",
              text: expect.stringContaining(
                "Document text:\ninvoice number INV-1"
              ),
            }),
          ]),
        }),
      ])
    )
  })

  it("sends images as data URLs without using file upload", async () => {
    const uploadFile = jest.fn()
    fetchWithBlacklistMock.mockResolvedValue({
      ok: true,
      buffer: jest
        .fn()
        .mockResolvedValue(Buffer.from([0xde, 0xad, 0xbe, 0xef])),
    } as any)

    const chatModel = createExtractMockLanguageModel([{ label: "receipt" }])

    getDefaultLLMMock.mockResolvedValue({
      chat: chatModel,
      uploadFile,
      providerOptions: undefined,
    })

    const result = await run({
      inputs: {
        source: DocumentSourceType.URL,
        file: "https://example.com/image.png",
        fileType: SupportedFileType.PNG,
        schema: { label: "string" },
      },
    })

    expect(result.success).toBe(true)
    expect(uploadFile).not.toHaveBeenCalled()
    expect(chatModel.doGenerateCalls).toHaveLength(1)
    expect(chatModel.doGenerateCalls[0].prompt).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          content: expect.arrayContaining([
            expect.objectContaining({
              type: "file",
              mediaType: "image/png",
              data: "3q2+7w==",
            }),
          ]),
        }),
      ])
    )
  })

  it("returns a clear error when extraction output is empty", async () => {
    fetchWithBlacklistMock.mockResolvedValue({
      ok: true,
      buffer: jest.fn().mockResolvedValue(Buffer.from("fake pdf bytes")),
    } as any)

    getDefaultLLMMock.mockResolvedValue({
      chat: createExtractMockLanguageModel([]),
      providerOptions: undefined,
      uploadFile: jest.fn().mockResolvedValue("file-123"),
    })

    PDFParseMock.mockImplementation(
      () =>
        ({
          getText: jest
            .fn()
            .mockResolvedValue({ text: "no match in document" }),
        }) as any
    )

    const result = await run({
      inputs: {
        source: DocumentSourceType.URL,
        file: "https://example.com/empty.pdf",
        fileType: SupportedFileType.PDF,
        schema: { value: "string" },
      },
    })

    expect(result.success).toBe(false)
    expect(result.response).toBe("Error: Could not extract the requested data.")
  })

  it("returns a clear error when url is blocked", async () => {
    fetchWithBlacklistMock.mockRejectedValue(
      new Error("URL is blocked or could not be resolved safely.")
    )

    getDefaultLLMMock.mockResolvedValue({
      chat: {} as any,
      providerOptions: undefined,
      uploadFile: jest.fn(),
    })

    const result = await run({
      inputs: {
        source: DocumentSourceType.URL,
        file: "http://169.254.169.254/metadata/v1/",
        fileType: SupportedFileType.PDF,
        schema: { value: "string" },
      },
    })

    expect(fetchWithBlacklistMock).toHaveBeenCalledWith(
      "http://169.254.169.254/metadata/v1/"
    )
    expect(result.success).toBe(false)
    expect(result.response).toContain(
      "URL is blocked or could not be resolved safely."
    )
  })
})
