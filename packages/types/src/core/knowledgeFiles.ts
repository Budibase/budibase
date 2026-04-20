export const KNOWLEDGE_FILE_EXTENSIONS = [
  ".txt",
  ".md",
  ".markdown",
  ".json",
  ".yaml",
  ".yml",
  ".csv",
  ".tsv",
  ".pdf",
  ".html",
  ".htm",
  ".xml",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".rtf",
] as const

export const KNOWLEDGE_FILE_MIME_TYPES = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "text/tab-separated-values",
  "application/pdf",
  "application/json",
  "application/yaml",
  "text/yaml",
  "application/xml",
  "text/xml",
  "text/html",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/rtf",
  "text/rtf",
] as const

export const KNOWLEDGE_FILE_ACCEPT_ATTRIBUTE =
  KNOWLEDGE_FILE_EXTENSIONS.join(",")

const KNOWLEDGE_FILE_EXTENSION_SET = new Set<string>(KNOWLEDGE_FILE_EXTENSIONS)
const KNOWLEDGE_FILE_MIME_TYPE_SET = new Set<string>(KNOWLEDGE_FILE_MIME_TYPES)

const trimString = (value?: string) =>
  typeof value === "string" ? value.trim() : ""

export const getKnowledgeFileExtension = (filename?: string) => {
  const normalized = trimString(filename).toLowerCase()
  const index = normalized.lastIndexOf(".")
  if (index < 0) {
    return ""
  }
  return normalized.slice(index)
}

export const isKnowledgeFileSupported = ({
  filename,
  mimetype,
}: {
  filename?: string
  mimetype?: string
}) => {
  const extension = getKnowledgeFileExtension(filename)
  if (extension && KNOWLEDGE_FILE_EXTENSION_SET.has(extension)) {
    return true
  }

  const normalizedMimetype = trimString(mimetype).toLowerCase()
  if (!normalizedMimetype) {
    return false
  }
  if (normalizedMimetype.startsWith("image/")) {
    return false
  }
  if (normalizedMimetype.startsWith("text/")) {
    return true
  }
  return KNOWLEDGE_FILE_MIME_TYPE_SET.has(normalizedMimetype)
}
