import { chunkDocument } from "../shared"
import type { RagFileProcessor, RagProcessInput } from "../types"

export const plainTextProcessor: RagFileProcessor = {
  async process(input: RagProcessInput) {
    return chunkDocument(input.buffer.toString("utf-8"))
  },
}
