import { describe, expect, it } from "vitest"
import {
  getKnowledgeFileDisplayType,
  KNOWLEDGE_FILE_EXTENSIONS,
  KNOWLEDGE_FILE_MIME_TYPES,
} from "@budibase/types"

const expectedByExtension: Record<string, string> = {
  ".txt": "Text",
  ".md": "Markdown",
  ".markdown": "Markdown",
  ".json": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".csv": "CSV",
  ".tsv": "TSV",
  ".pdf": "PDF",
  ".html": "HTML",
  ".htm": "HTML",
  ".xml": "XML",
  ".doc": "DOC",
  ".docx": "DOCX",
  ".ppt": "PPT",
  ".pptx": "PPTX",
  ".xls": "XLS",
  ".xlsx": "XLSX",
  ".rtf": "RTF",
}

const expectedByMimeType: Record<string, string> = {
  "text/plain": "Text",
  "text/markdown": "Markdown",
  "text/csv": "CSV",
  "text/tab-separated-values": "TSV",
  "application/pdf": "PDF",
  "application/json": "JSON",
  "application/yaml": "YAML",
  "text/yaml": "YAML",
  "application/xml": "XML",
  "text/xml": "XML",
  "text/html": "HTML",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "PPTX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/rtf": "RTF",
  "text/rtf": "RTF",
}

describe("getKnowledgeFileDisplayType", () => {
  it("covers all supported knowledge file extensions", () => {
    for (const extension of KNOWLEDGE_FILE_EXTENSIONS) {
      const label = getKnowledgeFileDisplayType({
        filename: `file${extension}`,
      })
      expect(label).toBe(expectedByExtension[extension])
    }
  })

  it("covers all supported knowledge file MIME types", () => {
    for (const mimetype of KNOWLEDGE_FILE_MIME_TYPES) {
      const label = getKnowledgeFileDisplayType({ mimetype })
      expect(label).toBe(expectedByMimeType[mimetype])
    }
  })

  it("prefers extension label over MIME label", () => {
    const label = getKnowledgeFileDisplayType({
      filename: "notes.docx",
      mimetype: "text/plain",
    })
    expect(label).toBe("DOCX")
  })

  it("uses short MIME subtype for unknown MIME types", () => {
    const label = getKnowledgeFileDisplayType({
      mimetype: "application/x-custom-type",
    })
    expect(label).toBe("X-CUSTOM-TYPE")
  })

  it("falls back to Text when no file metadata is provided", () => {
    const label = getKnowledgeFileDisplayType({})
    expect(label).toBe("Text")
  })
})
