const mockPdfGetText = jest.fn()

jest.mock("pdf-parse", () => ({
  PDFParse: jest.fn().mockImplementation(() => ({
    getText: mockPdfGetText,
  })),
}))

import { pdfProcessor } from "../pdf"
import { PDFParse } from "pdf-parse"

describe("pdfProcessor", () => {
  beforeEach(() => {
    mockPdfGetText.mockReset()
  })

  it("chunks parsed pdf text", async () => {
    const text = "Parsed PDF content"
    mockPdfGetText.mockResolvedValue({ text })
    const buffer = Buffer.from("fake pdf bytes")

    const chunks = await pdfProcessor.process({
      buffer,
    })

    expect(chunks).toEqual(["Parsed PDF content"])
    expect(PDFParse).toHaveBeenCalledWith({ data: buffer })
  })

  it("returns empty chunks when parsed pdf text is empty", async () => {
    mockPdfGetText.mockResolvedValue({ text: "" })

    const chunks = await pdfProcessor.process({
      buffer: Buffer.from("fake pdf bytes"),
    })

    expect(chunks).toEqual([])
  })
})
