import { PDFParse } from "pdf-parse"
import { chunkDocument } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

export const pdfProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    const parser = new PDFParse({ data: input.buffer as any })
    const parsed = await parser.getText()
    return chunkDocument((parsed.text || "").trim())
  },
}
