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
## The **Incident Response** Runbook \`v2\`

- Escalation path: Security Operations
      `),
      filename: "menu.md",
    })

    expect(chunks).toContain(
      [
        "The **Incident Response** Runbook `v2`",
        "Escalation path: Security Operations",
      ].join("\n")
    )
  })

  it("uses the yaml parser for yaml files", async () => {
    const chunks = await processFileToChunks({
      buffer: Buffer.from(`
service:
  name: Customer Support
  region: EMEA
teams:
  - support-ops
  - security-ops
      `),
      filename: "service.yaml",
    })

    expect(chunks).toContain(
      "service.name: Customer Support\nservice.region: EMEA"
    )
    expect(chunks).toContain("teams: support-ops, security-ops")
  })

  it("uses the markdown parser from mime type for extensionless files", async () => {
    const chunks = await processFileToChunks({
      buffer: Buffer.from(`
## The **Incident Response** Runbook \`v2\`

- Escalation path: Security Operations
      `),
      filename: "knowledge_base_upload",
      mimetype: "text/markdown",
    })

    expect(chunks).toContain(
      [
        "The **Incident Response** Runbook `v2`",
        "Escalation path: Security Operations",
      ].join("\n")
    )
  })

  it("uses the yaml parser from mime type for extensionless files", async () => {
    const chunks = await processFileToChunks({
      buffer: Buffer.from(`
name: Customer Support
region: EMEA
      `),
      filename: "knowledge_base_upload",
      mimetype: "application/x-yaml",
    })

    expect(chunks).toContain("name: Customer Support")
    expect(chunks).toContain("region: EMEA")
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
