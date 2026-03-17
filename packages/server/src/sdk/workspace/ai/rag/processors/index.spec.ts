const mockPdfGetText = jest.fn()

jest.mock("pdf-parse", () => ({
  PDFParse: jest.fn().mockImplementation(() => ({
    getText: mockPdfGetText,
  })),
}))

import { processFileToChunks } from "./index"

describe("rag processors", () => {
  beforeEach(() => {
    mockPdfGetText.mockReset()
  })

  it("uses the markdown parser for markdown files", async () => {
    const chunks = await processFileToChunks({
      buffer: Buffer.from(`
## The **Krusty Krab** Menu \`v2\`

- Signature item: Krabby Patty
      `),
      filename: "menu.md",
    })

    expect(chunks).toContain(
      ["The Krusty Krab Menu v2", "Signature item: Krabby Patty"].join("\n")
    )
  })

  it("uses the yaml parser for OpenAPI yaml files", async () => {
    const chunks = await processFileToChunks({
      buffer: Buffer.from(`
openapi: 3.0.0
info:
  title: Pets API
  version: 1.2.3
paths:
  /pets:
    get:
      summary: List pets
      tags: [pets]
      parameters:
        - name: limit
          in: query
          required: false
      responses:
        "200":
          description: Success
      `),
      filename: "openapi.yaml",
    })

    expect(chunks).toContain(
      [
        "GET /pets",
        "List pets",
        "Tags: pets",
        "Parameters: limit (query) - optional",
        "Responses: 200: Success",
      ].join("\n")
    )
  })

  it("uses the pdf parser when mime type is pdf", async () => {
    mockPdfGetText.mockResolvedValue({ text: "Parsed PDF content" })

    const chunks = await processFileToChunks({
      buffer: Buffer.from("not a real pdf"),
      filename: "notes.txt",
      mimetype: "application/pdf",
    })

    expect(chunks).toEqual(["Parsed PDF content"])
  })

  it("falls back to plain text chunking for unknown file types", async () => {
    const chunks = await processFileToChunks({
      buffer: Buffer.from("plain text fallback"),
      filename: "notes.custom",
    })

    expect(chunks).toEqual(["plain text fallback"])
  })
})
