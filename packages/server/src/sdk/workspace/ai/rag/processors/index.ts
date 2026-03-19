import { markdownProcessor } from "./filetype/markdown"
import { pdfProcessor } from "./filetype/pdf"
import { plainTextProcessor } from "./filetype/plainText"
import { getFileExtension } from "./shared"
import { yamlProcessor } from "./filetype/yaml"
import type { RagFileProcessor, RagProcessInput } from "./types"

const processorByExtension: Record<string, RagFileProcessor> = {
  md: markdownProcessor,
  markdown: markdownProcessor,
  pdf: pdfProcessor,
  yaml: yamlProcessor,
  yml: yamlProcessor,
}

const processorByMimeType: Record<string, RagFileProcessor> = {
  "application/pdf": pdfProcessor,
  "text/markdown": markdownProcessor,
  "text/x-markdown": markdownProcessor,
  "application/markdown": markdownProcessor,
  "application/x-yaml": yamlProcessor,
  "application/yaml": yamlProcessor,
  "text/yaml": yamlProcessor,
  "text/x-yaml": yamlProcessor,
}

const resolveProcessor = (
  file?: Pick<RagProcessInput, "filename" | "mimetype">
) => {
  const mimeType = file?.mimetype?.toLowerCase().split(";")[0]?.trim()
  if (mimeType && processorByMimeType[mimeType]) {
    return processorByMimeType[mimeType]
  }

  const extension = getFileExtension(file?.filename)
  return processorByExtension[extension] || plainTextProcessor
}

export const processFileToChunks = async (
  input: RagProcessInput
): Promise<string[]> => {
  return await resolveProcessor(input).process(input)
}

export * from "./types"
