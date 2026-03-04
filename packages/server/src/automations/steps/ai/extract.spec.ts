import { DocumentSourceType, SupportedFileType } from "@budibase/types"
import { generateText } from "ai"
import sdk from "../../../sdk"
import fetch from "node-fetch"
import { PDFParse } from "pdf-parse"
import { run } from "./extract"

jest.mock("node-fetch", () => jest.fn())

jest.mock("pdf-parse", () => ({
  PDFParse: jest.fn(),
}))

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    generateText: jest.fn(),
  }
})

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

describe("extract file data step unit tests", () => {
  const getDefaultLLMMock = sdk.ai.llm
    .getDefaultLLMOrThrow as jest.MockedFunction<
    typeof sdk.ai.llm.getDefaultLLMOrThrow
  >
  const generateTextMock = generateText as jest.MockedFunction<
    typeof generateText
  >
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>
  const PDFParseMock = PDFParse as jest.MockedClass<typeof PDFParse>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("falls back to inline pdf text when llm.uploadFile is unavailable", async () => {
    fetchMock.mockResolvedValue({
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

    getDefaultLLMMock.mockResolvedValue({
      chat: {} as any,
      embedding: {} as any,
      providerOptions: undefined,
    })

    generateTextMock.mockResolvedValue({
      output: { data: [{ invoiceNumber: "INV-1" }] },
    } as any)

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
    expect(generateTextMock).toHaveBeenCalledTimes(1)
    expect(generateTextMock.mock.calls[0][0].messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          content: expect.stringContaining(
            "Document text:\ninvoice number INV-1"
          ),
        }),
      ])
    )
  })

  it("sends images as data URLs without using file upload", async () => {
    const uploadFile = jest.fn()
    fetchMock.mockResolvedValue({
      ok: true,
      buffer: jest
        .fn()
        .mockResolvedValue(Buffer.from([0xde, 0xad, 0xbe, 0xef])),
    } as any)

    getDefaultLLMMock.mockResolvedValue({
      chat: {} as any,
      embedding: {} as any,
      uploadFile,
      providerOptions: undefined,
    })

    generateTextMock.mockResolvedValue({
      output: { data: [{ label: "receipt" }] },
    } as any)

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
    expect(generateTextMock).toHaveBeenCalledTimes(1)
    expect(generateTextMock.mock.calls[0][0].messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "user",
          content: expect.arrayContaining([
            expect.objectContaining({
              type: "image",
              image: new URL("data:image/png;base64,3q2+7w=="),
            }),
          ]),
        }),
      ])
    )
  })

  it("returns a clear error when extraction output is empty", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      buffer: jest.fn().mockResolvedValue(Buffer.from("fake pdf bytes")),
    } as any)

    getDefaultLLMMock.mockResolvedValue({
      chat: {} as any,
      embedding: {} as any,
      providerOptions: undefined,
    })

    PDFParseMock.mockImplementation(
      () =>
        ({
          getText: jest
            .fn()
            .mockResolvedValue({ text: "no match in document" }),
        }) as any
    )

    generateTextMock.mockResolvedValue({
      output: { data: [] },
    } as any)

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
})
