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

const DISPLAY_LABEL_BY_EXTENSION: Partial<
  Record<(typeof KNOWLEDGE_FILE_EXTENSIONS)[number], string>
> = {
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

const DISPLAY_LABEL_BY_MIME_TYPE: Partial<
  Record<(typeof KNOWLEDGE_FILE_MIME_TYPES)[number], string>
> = {
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

const fallbackLabelFromMimeType = (mimetype?: string) => {
  const normalized = trimString(mimetype).toLowerCase()
  if (!normalized) {
    return "Text"
  }
  const [, subtype] = normalized.split("/")
  if (!subtype) {
    return normalized.toUpperCase()
  }
  return subtype.toUpperCase()
}

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

export const getKnowledgeFileDisplayType = ({
  filename,
  mimetype,
}: {
  filename?: string
  mimetype?: string
}) => {
  const extension = getKnowledgeFileExtension(filename) as
    | (typeof KNOWLEDGE_FILE_EXTENSIONS)[number]
    | ""
  if (extension) {
    const extensionLabel = DISPLAY_LABEL_BY_EXTENSION[extension]
    if (extensionLabel) {
      return extensionLabel
    }
  }

  const normalizedMimetype = trimString(mimetype).toLowerCase() as
    | (typeof KNOWLEDGE_FILE_MIME_TYPES)[number]
    | ""
  if (normalizedMimetype) {
    const mimetypeLabel = DISPLAY_LABEL_BY_MIME_TYPE[normalizedMimetype]
    if (mimetypeLabel) {
      return mimetypeLabel
    }
  }

  return fallbackLabelFromMimeType(mimetype)
}
