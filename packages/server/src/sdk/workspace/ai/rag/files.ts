import { embedMany } from "ai"
import * as crypto from "crypto"
import { PDFParse } from "pdf-parse"
import { parse as parseYaml } from "yaml"
import {
  AgentMessageRagSource,
  type Agent,
  type KnowledgeBase,
  type KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import { createVectorDb, type ChunkInput } from "../vectorDb/utils"
import { knowledgeBase as knowledgeBaseSdk } from ".."
import { createLLM } from "../llm"

interface RagFileInput {
  filename?: string
  mimetype?: string
  ragSourceId: string
}

const DEFAULT_CHUNK_SIZE = 1500
const DEFAULT_CHUNK_OVERLAP = 200
const DEFAULT_EMBEDDING_BATCH_SIZE = 64
const DEFAULT_RAG_TOP_K = 4
const DEFAULT_RAG_MIN_SIMILARITY = 0.7

const textFileExtensions = new Set([
  ".txt",
  ".md",
  ".markdown",
  ".json",
  ".yaml",
  ".yml",
  ".csv",
  ".tsv",
])

const yamlExtensions = new Set([".yaml", ".yml"])

const hashChunk = (chunk: string) => {
  return crypto.createHash("sha256").update(chunk).digest("hex")
}

const chunkDocument = (
  text: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP
) => {
  const normalized = text.replace(/\r\n/g, "\n")
  const chunks: string[] = []
  let start = 0
  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length)
    const chunk = normalized.slice(start, end).trim()
    if (chunk) {
      chunks.push(chunk)
    }
    if (end === normalized.length) {
      break
    }
    start = Math.max(0, end - overlap)
    if (start >= normalized.length) {
      break
    }
  }
  return chunks
}

const formatParameters = (parameters: any[] = []) => {
  if (!Array.isArray(parameters) || parameters.length === 0) {
    return "None"
  }
  return parameters
    .map(param => {
      const location = param?.in ? `(${param.in})` : ""
      const required = param?.required ? "required" : "optional"
      return `${param?.name ?? "unknown"} ${location} - ${required}`
    })
    .join("; ")
}

const formatResponses = (responses: Record<string, any> = {}) => {
  const entries = Object.entries(responses)
  if (entries.length === 0) {
    return "None"
  }
  return entries
    .map(
      ([status, response]) =>
        `${status}: ${response?.description ?? "No description"}`
    )
    .join("; ")
}

const buildOpenApiChunks = (doc: Record<string, any>) => {
  if (!doc || typeof doc !== "object") {
    return []
  }

  const chunks: string[] = []

  if (doc.info) {
    chunks.push(
      [
        `OpenAPI ${doc.openapi ?? ""}`.trim(),
        doc.info.title ? `Title: ${doc.info.title}` : null,
        doc.info.version ? `Version: ${doc.info.version}` : null,
        doc.info.description ?? null,
      ]
        .filter(Boolean)
        .join("\n")
    )
  }

  if (doc.paths && typeof doc.paths === "object") {
    for (const [pathKey, methods] of Object.entries<any>(doc.paths)) {
      if (!methods || typeof methods !== "object") {
        continue
      }
      for (const [method, definition] of Object.entries<any>(methods)) {
        if (!definition || typeof definition !== "object") {
          continue
        }
        const header = `${method.toUpperCase()} ${pathKey}`
        const summary =
          definition.summary ?? definition.operationId ?? "No summary provided"
        const description = definition.description ?? ""
        const parameters = formatParameters(definition.parameters)
        const responses = formatResponses(definition.responses)
        const tags = Array.isArray(definition.tags)
          ? `Tags: ${definition.tags.join(", ")}`
          : ""
        const chunk = [
          header,
          summary,
          description,
          tags,
          `Parameters: ${parameters}`,
          `Responses: ${responses}`,
        ]
          .filter(Boolean)
          .join("\n")
        chunks.push(chunk)
      }
    }
  }

  if (doc.components?.schemas) {
    for (const [schemaName, schemaDef] of Object.entries<any>(
      doc.components.schemas
    )) {
      const props =
        schemaDef?.properties && typeof schemaDef.properties === "object"
          ? Object.keys(schemaDef.properties).join(", ")
          : "No properties listed"
      chunks.push(
        [
          `Schema: ${schemaName}`,
          schemaDef?.description ?? "No description",
          `Properties: ${props}`,
        ].join("\n")
      )
    }
  }

  return chunks
}

const createChunksFromContent = (content: string, filename?: string) => {
  const ext = (filename?.split(".").pop() || "").toLowerCase()
  if (yamlExtensions.has(`.${ext}`) || yamlExtensions.has(ext)) {
    try {
      const parsed = parseYaml(content)
      const openApiChunks = buildOpenApiChunks(parsed)
      if (openApiChunks.length > 0) {
        return openApiChunks.flatMap(chunk =>
          chunk.length > DEFAULT_CHUNK_SIZE ? chunkDocument(chunk) : [chunk]
        )
      }
    } catch (error) {
      console.warn(
        "Failed to parse YAML for agent upload, falling back to plain chunking",
        error
      )
    }
  }
  return chunkDocument(content)
}

const getEmbeddingModel = async (configId: string) => {
  const { embedding } = await createLLM(configId)
  return embedding
}

const resolveKnowledgeBasesForAgent = async (
  agent: Agent
): Promise<KnowledgeBase[]> => {
  const knowledgeBaseIds = (agent.knowledgeBases || []).filter(Boolean)
  if (knowledgeBaseIds.length === 0) {
    throw new Error("No knowledge base is configured for this agent")
  }

  const knowledgeBases: KnowledgeBase[] = []
  for (const knowledgeBaseId of knowledgeBaseIds) {
    const config = await knowledgeBaseSdk.find(knowledgeBaseId)
    if (config) {
      knowledgeBases.push(config)
    }
  }

  if (knowledgeBases.length === 0) {
    throw new Error("No valid knowledge base is configured for this agent")
  }

  return knowledgeBases
}

const embedChunks = async (
  configId: string,
  chunks: string[],
  batchSize = DEFAULT_EMBEDDING_BATCH_SIZE
) => {
  const model = await getEmbeddingModel(configId)
  const embeddings: number[][] = []

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const { embeddings: batchEmbeddings } = await embedMany({
      model,
      values: batch,
    })
    embeddings.push(...batchEmbeddings)
  }

  return embeddings
}

const isPdfFile = (file?: Pick<RagFileInput, "filename" | "mimetype">) => {
  if (!file) {
    return false
  }
  const mime = file.mimetype?.toLowerCase()
  if (mime === "application/pdf") {
    return true
  }
  const ext = (file.filename?.split(".").pop() || "").toLowerCase()
  return ext === "pdf" || ext === ".pdf"
}

const getTextFromBuffer = async (
  buffer: Buffer,
  file: Pick<RagFileInput, "filename" | "mimetype">
) => {
  if (isPdfFile(file)) {
    const parser = new PDFParse({ data: buffer as any })
    const parsed = await parser.getText()
    return (parsed.text || "").trim()
  }

  const ext = (file.filename?.split(".").pop() || "").toLowerCase()
  if (!file.filename) {
    return buffer.toString("utf-8")
  }
  if (textFileExtensions.has(`.${ext}`) || textFileExtensions.has(ext)) {
    return buffer.toString("utf-8")
  }
  return buffer.toString("utf-8")
}

export const ingestKnowledgeBaseFile = async (
  knowledgeBase: KnowledgeBase,
  knowledgeBaseFile: RagFileInput,
  fileBuffer: Buffer
): Promise<{
  inserted: number
  total: number
}> => {
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new Error("Knowledge base id not set")
  }

  const content = await getTextFromBuffer(fileBuffer, knowledgeBaseFile)
  const chunks = createChunksFromContent(content, knowledgeBaseFile.filename)

  const vectorDb = await createVectorDb({
    namespaceId: knowledgeBaseId,
    vectorDbId: knowledgeBase.vectorDb,
  })

  if (chunks.length === 0) {
    // This will ensure any existing chunks for the source are removed
    await vectorDb.deleteBySourceIds([knowledgeBaseFile.ragSourceId])
    return { inserted: 0, total: 0 }
  }

  const embeddings = await embedChunks(knowledgeBase.embeddingModel, chunks)
  if (embeddings.length !== chunks.length) {
    throw new Error("Embedding response size mismatch")
  }

  const payloads = chunks.map<ChunkInput>((chunk, index) => ({
    hash: hashChunk(chunk),
    text: chunk,
    embedding: embeddings[index],
  }))

  return await vectorDb.upsertSourceChunks(
    knowledgeBaseFile.ragSourceId,
    payloads
  )
}

export const deleteKnowledgeBaseFileChunks = async (
  knowledgeBase: KnowledgeBase,
  sourceIds: string[]
) => {
  if (!sourceIds || sourceIds.length === 0) {
    return
  }
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new Error("Knowledge base id not set")
  }

  const vectorDb = await createVectorDb({
    namespaceId: knowledgeBaseId,
    vectorDbId: knowledgeBase.vectorDb,
  })
  await vectorDb.deleteBySourceIds(sourceIds)
}

export interface RetrievedContextChunk {
  sourceId: string
  chunkText: string
  chunkHash: string
}

interface RetrievedContextResult {
  text: string
  chunks: RetrievedContextChunk[]
  sources: AgentMessageRagSource[]
}

export const retrieveContextForAgent = async (
  agent: Agent,
  question: string
): Promise<RetrievedContextResult> => {
  if (!question || question.trim().length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const knowledgeBases = await resolveKnowledgeBasesForAgent(agent)
  const maxDistance = 1 - DEFAULT_RAG_MIN_SIMILARITY
  const retrieved: Array<RetrievedContextChunk & { distance: number }> = []
  const files: KnowledgeBaseFile[] = []

  for (const knowledgeBase of knowledgeBases) {
    const knowledgeBaseId = knowledgeBase._id
    if (!knowledgeBaseId) {
      continue
    }

    const knowledgeBaseFiles =
      await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
    files.push(...knowledgeBaseFiles)

    const readyFileSources = knowledgeBaseFiles
      .filter(
        file =>
          file.status === KnowledgeBaseFileStatus.READY && file.ragSourceId
      )
      .map(file => file.ragSourceId)

    if (readyFileSources.length === 0) {
      continue
    }

    const [queryEmbedding] = await embedChunks(
      knowledgeBase.embeddingModel,
      [question],
      1
    )
    if (!queryEmbedding?.length) {
      throw new Error("Embedding response missing dimensions")
    }

    const vectorDb = await createVectorDb({
      namespaceId: knowledgeBaseId,
      vectorDbId: knowledgeBase.vectorDb,
    })
    const rows = await vectorDb.queryNearest(
      queryEmbedding,
      readyFileSources,
      DEFAULT_RAG_TOP_K
    )

    retrieved.push(
      ...rows
        .filter(row => row.distance <= maxDistance)
        .map(row => ({
          sourceId: row.source,
          chunkText: row.chunkText,
          chunkHash: row.chunkHash,
          distance: row.distance,
        }))
    )
  }

  if (retrieved.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const chunks: RetrievedContextChunk[] = retrieved
    .sort((a, b) => a.distance - b.distance)
    .slice(0, DEFAULT_RAG_TOP_K)
    .map(({ distance: _distance, ...chunk }) => chunk)

  return {
    text: chunks.map(chunk => chunk.chunkText).join("\n\n"),
    chunks,
    sources: toSourceMetadata(chunks, files),
  }
}

const toSourceMetadata = (
  chunks: RetrievedContextChunk[],
  files: KnowledgeBaseFile[]
): AgentMessageRagSource[] => {
  const fileBySourceId = new Map(files.map(file => [file.ragSourceId, file]))
  const summary = new Map<string, AgentMessageRagSource>()

  for (const chunk of chunks) {
    const file = fileBySourceId.get(chunk.sourceId)
    if (!summary.has(chunk.sourceId)) {
      summary.set(chunk.sourceId, {
        sourceId: chunk.sourceId,
        fileId: file?._id,
        filename: file?.filename ?? chunk.sourceId,
        chunkCount: 0,
      })
    }
    const entry = summary.get(chunk.sourceId)!
    entry.chunkCount += 1
  }
  return Array.from(summary.values())
}
