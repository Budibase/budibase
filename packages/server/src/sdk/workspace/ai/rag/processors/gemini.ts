import {
  GeminiKnowledgeBase,
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
} from "@budibase/types"
import { RagProcessor, RetrievedContextChunk } from "."
import {
  deleteGeminiFileFromStore,
  ingestGeminiFile,
  searchGeminiFileStore,
} from "../../knowledgeBase/geminiFileStore"
import { updateKnowledgeBaseFile } from "../../knowledgeBase"

export class GeminiRagProcessor implements RagProcessor {
  private knowledgeBase: GeminiKnowledgeBase

  constructor(knowledgeBase: KnowledgeBase) {
    if (knowledgeBase.type !== KnowledgeBaseType.GEMINI) {
      throw new Error(
        `GeminiRagProcessor is not compatible with knowledge base type ${knowledgeBase.type}`
      )
    }

    this.knowledgeBase = knowledgeBase
  }

  async ingestKnowledgeBaseFile(
    input: KnowledgeBaseFile,
    fileBuffer: Buffer
  ): Promise<void> {
    const startedAtMs = Date.now()
    const knowledgeBaseId = this.knowledgeBase._id
    console.log("Starting Gemini RAG file ingestion", {
      knowledgeBaseId,
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      fileId: input._id,
      filename: input.filename,
      mimetype: input.mimetype,
      fileSize: fileBuffer.byteLength,
    })

    try {
      const ingested = await ingestGeminiFile({
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        filename: input.filename,
        mimetype: input.mimetype,
        buffer: fileBuffer,
      })

      input.status = KnowledgeBaseFileStatus.READY
      input.ragSourceId = ingested.fileId
      input.processedAt = new Date().toISOString()
      input.errorMessage = undefined
      await updateKnowledgeBaseFile(input)
      console.log("Completed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId: input._id,
        ragSourceId: input.ragSourceId,
        durationMs: Date.now() - startedAtMs,
      })
    } catch (error) {
      console.error("Failed Gemini RAG file ingestion", {
        knowledgeBaseId,
        vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
        fileId: input._id,
        filename: input.filename,
        durationMs: Date.now() - startedAtMs,
        error,
      })
      throw error
    }
  }

  async search(question: string): Promise<RetrievedContextChunk[]> {
    const rows = await searchGeminiFileStore({
      vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
      query: question,
    })

    const results = rows.map<RetrievedContextChunk>(row => {
      const pageNumber = extractPageNumber(row)
      if (!pageNumber && isPdfLike(row)) {
        console.log("Gemini RAG result missing page metadata", {
          vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
          fileId: row.file_id,
          filename: row.filename,
          topLevelKeys: Object.keys(row),
          metadataKeys:
            row.metadata && typeof row.metadata === "object"
              ? Object.keys(row.metadata as Record<string, unknown>)
              : [],
          contentItemCount: Array.isArray(row.content) ? row.content.length : 0,
          firstContentKeys:
            Array.isArray(row.content) &&
            row.content[0] &&
            typeof row.content[0] === "object"
              ? Object.keys(row.content[0] as Record<string, unknown>)
              : [],
          attributesType: Array.isArray(row.attributes)
            ? "array"
            : typeof row.attributes,
          attributesKeys:
            row.attributes &&
            typeof row.attributes === "object" &&
            !Array.isArray(row.attributes)
              ? Object.keys(row.attributes as Record<string, unknown>)
              : [],
          attributesPreview:
            row.attributes &&
            typeof row.attributes === "object" &&
            !Array.isArray(row.attributes)
              ? sanitizeAttributePreview(row.attributes)
              : undefined,
          firstAttributeKeys:
            Array.isArray(row.attributes) &&
            row.attributes[0] &&
            typeof row.attributes[0] === "object"
              ? Object.keys(row.attributes[0] as Record<string, unknown>)
              : [],
          firstAttributePreview:
            Array.isArray(row.attributes) && row.attributes[0]
              ? sanitizeAttributePreview(row.attributes[0])
              : typeof row.attributes === "string"
                ? row.attributes.slice(0, 300)
                : undefined,
        })
      }

      return {
        source: getChunkSource(row),
        chunkText: getChunkText(row),
        pageNumber,
      }
    })

    return results
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    const filteredIds = fileIds.filter(Boolean)
    await Promise.all(
      filteredIds.map(fileId =>
        deleteGeminiFileFromStore({
          vectorStoreId: this.knowledgeBase.config.googleFileStoreId,
          fileId,
        })
      )
    )
  }
}

const isPdfLike = (row: Record<string, unknown>) => {
  const filename = row.filename
  if (typeof filename !== "string") {
    return false
  }
  return filename.toLowerCase().endsWith(".pdf")
}

const asRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined
  }
  return value as Record<string, unknown>
}

const getRetrievedContext = (
  value: Record<string, unknown>
): Record<string, unknown> | undefined => {
  return asRecord(value.retrievedContext) || asRecord(value.retrieved_context)
}

const getStringValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed || undefined
}

const getChunkSource = (row: Record<string, unknown>): string | undefined => {
  const retrievedContext = getRetrievedContext(row)
  const sourceCandidates = [
    row.file_id,
    row.filename,
    row.id,
    retrievedContext?.title,
    retrievedContext?.uri,
  ]

  for (const candidate of sourceCandidates) {
    const value = getStringValue(candidate)
    if (value) {
      return value
    }
  }

  return undefined
}

const getChunkTextFromPart = (part: unknown): string | undefined => {
  const directText = getStringValue(part)
  if (directText) {
    return directText
  }

  const record = asRecord(part)
  if (!record) {
    return undefined
  }

  return (
    getStringValue(record.text) ||
    getStringValue(getRetrievedContext(record)?.text)
  )
}

const getChunkText = (row: Record<string, unknown>): string => {
  const content = row.content
  if (Array.isArray(content)) {
    return content
      .map(getChunkTextFromPart)
      .filter((text): text is string => Boolean(text))
      .join("\n")
      .trim()
  }

  return (
    getStringValue(content) ||
    getStringValue(getRetrievedContext(row)?.text) ||
    ""
  )
}

const toPositiveInteger = (value: unknown): number | undefined => {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN
  if (!Number.isFinite(numeric)) {
    return undefined
  }
  const rounded = Math.floor(numeric)
  if (rounded < 1) {
    return undefined
  }
  return rounded
}

const toPageNumberFromIndex = (value: unknown): number | undefined => {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN
  if (!Number.isFinite(numeric)) {
    return undefined
  }
  const rounded = Math.floor(numeric)
  if (rounded < 0) {
    return undefined
  }
  return rounded + 1
}

const extractPageNumber = (
  row: Record<string, unknown>
): number | undefined => {
  const retrievedContextPage = extractPageNumberFromRetrievedContext(row)
  if (retrievedContextPage) {
    return retrievedContextPage
  }

  const groundingMetadataPage = extractPageNumberFromGroundingMetadata(row)
  if (groundingMetadataPage) {
    return groundingMetadataPage
  }

  const directPageCandidates = [
    row.page,
    row.pageNumber,
    row.page_number,
    row.pageNo,
    row.page_no,
    row.pageNum,
    row.page_num,
  ]
  for (const candidate of directPageCandidates) {
    const page = toPositiveInteger(candidate)
    if (page) {
      return page
    }
  }

  // Some providers return page zero for the first page using `page` fields.
  // Convert this to user-facing 1-based numbering.
  for (const candidate of directPageCandidates) {
    if (toZeroBasedPageIndex(candidate)) {
      return 1
    }
  }

  const directPageIndexCandidates = [row.pageIndex, row.page_index]
  for (const candidate of directPageIndexCandidates) {
    const page = toPageNumberFromIndex(candidate)
    if (page) {
      return page
    }
  }

  const metadata = row.metadata
  if (metadata && typeof metadata === "object") {
    const meta = metadata as Record<string, unknown>
    const metadataPageCandidates = [
      meta.page,
      meta.pageNumber,
      meta.page_number,
      meta.pageNo,
      meta.page_no,
      meta.pageNum,
      meta.page_num,
    ]
    for (const candidate of metadataPageCandidates) {
      const page = toPositiveInteger(candidate)
      if (page) {
        return page
      }
    }

    for (const candidate of metadataPageCandidates) {
      if (toZeroBasedPageIndex(candidate)) {
        return 1
      }
    }

    const metadataPageIndexCandidates = [meta.pageIndex, meta.page_index]
    for (const candidate of metadataPageIndexCandidates) {
      const page = toPageNumberFromIndex(candidate)
      if (page) {
        return page
      }
    }
  }

  const attributes = row.attributes
  if (typeof attributes === "string") {
    const parsedAttributes = tryParseJson(attributes)
    if (parsedAttributes) {
      const page = extractPageNumberFromNested(parsedAttributes)
      if (page) {
        return page
      }
    }
  }

  if (attributes && typeof attributes === "object") {
    const page = extractPageNumberFromNested(attributes)
    if (page) {
      return page
    }
  }

  const content = row.content
  if (Array.isArray(content)) {
    for (const part of content) {
      if (!part || typeof part !== "object") {
        continue
      }
      const segment = part as Record<string, unknown>
      const segmentPageCandidates = [
        segment.page,
        segment.pageNumber,
        segment.page_number,
        segment.pageNo,
        segment.page_no,
        segment.pageNum,
        segment.page_num,
      ]
      for (const candidate of segmentPageCandidates) {
        const page = toPositiveInteger(candidate)
        if (page) {
          return page
        }
      }

      for (const candidate of segmentPageCandidates) {
        if (toZeroBasedPageIndex(candidate)) {
          return 1
        }
      }

      const segmentPageIndexCandidates = [segment.pageIndex, segment.page_index]
      for (const candidate of segmentPageIndexCandidates) {
        const page = toPageNumberFromIndex(candidate)
        if (page) {
          return page
        }
      }
    }
  }

  const deepCandidate = extractPageNumberFromNested(row)
  if (deepCandidate) {
    return deepCandidate
  }

  return undefined
}

const extractPageNumberFromRetrievedContext = (
  value: Record<string, unknown>
): number | undefined => {
  const retrievedContext = getRetrievedContext(value)
  if (!retrievedContext) {
    return undefined
  }

  const directPage = extractDirectPageNumber(retrievedContext)
  if (directPage) {
    return directPage
  }

  return extractPageNumberFromNested(retrievedContext)
}

const extractPageNumberFromGroundingMetadata = (
  row: Record<string, unknown>
): number | undefined => {
  const metadata =
    asRecord(row.groundingMetadata) || asRecord(row.grounding_metadata)
  if (!metadata) {
    return undefined
  }

  const groundingChunks = metadata.groundingChunks || metadata.grounding_chunks
  if (!Array.isArray(groundingChunks)) {
    return undefined
  }

  for (const chunk of groundingChunks) {
    const chunkRecord = asRecord(chunk)
    if (!chunkRecord) {
      continue
    }
    const page = extractPageNumberFromRetrievedContext(chunkRecord)
    if (page) {
      return page
    }
  }

  return undefined
}

const extractDirectPageNumber = (
  record: Record<string, unknown>
): number | undefined => {
  const pageCandidates = [
    record.page,
    record.pageNumber,
    record.page_number,
    record.pageNo,
    record.page_no,
    record.pageNum,
    record.page_num,
  ]

  for (const candidate of pageCandidates) {
    const page = toPositiveInteger(candidate)
    if (page) {
      return page
    }
  }

  for (const candidate of pageCandidates) {
    if (toZeroBasedPageIndex(candidate)) {
      return 1
    }
  }

  const pageIndexCandidates = [record.pageIndex, record.page_index]
  for (const candidate of pageIndexCandidates) {
    const page = toPageNumberFromIndex(candidate)
    if (page) {
      return page
    }
  }

  return undefined
}

const extractPageNumberFromNested = (
  value: unknown,
  depth = 0
): number | undefined => {
  if (depth > 6 || value == null) {
    return undefined
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const page = extractPageNumberFromNested(entry, depth + 1)
      if (page) {
        return page
      }
    }
    return undefined
  }

  if (typeof value !== "object") {
    if (typeof value === "string") {
      return extractPageNumberFromString(value)
    }
    return undefined
  }

  const record = value as Record<string, unknown>
  const entries = Object.entries(record)

  for (const [key, candidate] of entries) {
    const normalized = key.toLowerCase()

    const pageFromKv = extractPageNumberFromKeyValueLike(
      normalized,
      candidate,
      record
    )
    if (pageFromKv) {
      return pageFromKv
    }

    if (
      normalized === "page" ||
      normalized === "pagenumber" ||
      normalized === "page_number" ||
      normalized === "pageno" ||
      normalized === "page_no" ||
      normalized === "pagenum" ||
      normalized === "page_num"
    ) {
      const page = toPositiveInteger(candidate)
      if (page) {
        return page
      }
      if (toZeroBasedPageIndex(candidate)) {
        return 1
      }
    }

    if (normalized === "pageindex" || normalized === "page_index") {
      const page = toPageNumberFromIndex(candidate)
      if (page) {
        return page
      }
    }

    if (normalized === "pages" && Array.isArray(candidate)) {
      for (const pageCandidate of candidate) {
        const page = toPositiveInteger(pageCandidate)
        if (page) {
          return page
        }
        if (toZeroBasedPageIndex(pageCandidate)) {
          return 1
        }
      }
    }
  }

  for (const [, nested] of entries) {
    const page = extractPageNumberFromNested(nested, depth + 1)
    if (page) {
      return page
    }
  }

  return undefined
}

const extractPageNumberFromKeyValueLike = (
  key: string,
  candidate: unknown,
  record: Record<string, unknown>
): number | undefined => {
  const keyIsKeyLike = key === "key" || key === "name" || key === "field"
  if (!keyIsKeyLike || typeof candidate !== "string") {
    return undefined
  }

  const normalizedCandidate = candidate.toLowerCase().trim()
  const isPageField =
    normalizedCandidate === "page" ||
    normalizedCandidate === "pagenumber" ||
    normalizedCandidate === "page_number" ||
    normalizedCandidate === "pageno" ||
    normalizedCandidate === "page_no" ||
    normalizedCandidate === "pagenum" ||
    normalizedCandidate === "page_num" ||
    normalizedCandidate === "pageindex" ||
    normalizedCandidate === "page_index"

  if (!isPageField) {
    return undefined
  }

  const valueCandidate =
    record.value ?? record.val ?? record.page ?? record.pageNumber
  const asPage = toPositiveInteger(valueCandidate)
  if (asPage) {
    return asPage
  }

  if (
    normalizedCandidate === "pageindex" ||
    normalizedCandidate === "page_index"
  ) {
    const fromIndex = toPageNumberFromIndex(valueCandidate)
    if (fromIndex) {
      return fromIndex
    }
    return undefined
  }

  if (toZeroBasedPageIndex(valueCandidate)) {
    return 1
  }

  return undefined
}

const toZeroBasedPageIndex = (value: unknown): boolean => {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN
  if (!Number.isFinite(numeric)) {
    return false
  }
  return Math.floor(numeric) === 0
}

const tryParseJson = (value: string): unknown | undefined => {
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

const extractPageNumberFromString = (value: string): number | undefined => {
  const directNumeric = toPositiveInteger(value)
  if (directNumeric) {
    return directNumeric
  }

  const match = value
    .toLowerCase()
    .match(
      /(?:page|page\s*number|page[_\s-]*no|page[_\s-]*num|p)\s*[:=#-]?\s*(\d{1,4})/
    )
  if (!match) {
    return undefined
  }
  return toPositiveInteger(match[1])
}

const sanitizeAttributePreview = (value: unknown): unknown => {
  if (!value || typeof value !== "object") {
    return value
  }
  const record = value as Record<string, unknown>
  const limitedEntries = Object.entries(record).slice(0, 8)
  return Object.fromEntries(
    limitedEntries.map(([k, v]) => {
      if (typeof v === "string") {
        return [k, v.slice(0, 120)]
      }
      if (Array.isArray(v)) {
        return [k, `[array:${v.length}]`]
      }
      if (v && typeof v === "object") {
        return [k, "[object]"]
      }
      return [k, v]
    })
  )
}
