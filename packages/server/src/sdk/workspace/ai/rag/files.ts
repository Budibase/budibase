import { embedMany } from "ai"
import * as crypto from "crypto"
import { PDFParse } from "pdf-parse"
import { parse as parseYaml } from "yaml"
import { HTTPError } from "@budibase/backend-core"
import {
  AgentFileStatus,
  AgentMessageRagSource,
  type Agent,
  type AgentFile,
  type VectorDb,
} from "@budibase/types"
import { getLiteLLMModelConfigOrThrow } from "../configs"
import { find as findVectorDb } from "../vectorDb/crud"
import { createVectorDb, type ChunkInput } from "../vectorDb/utils"
import { agents } from ".."
import { createLiteLLMOpenAI } from "../llm"

const DEFAULT_CHUNK_SIZE = 1500
const DEFAULT_CHUNK_OVERLAP = 200
const DEFAULT_EMBEDDING_BATCH_SIZE = 64

interface ResolvedRagConfig {
  embeddingModel: string
  baseUrl: string
  apiKey: string
  vectorDb: VectorDb
}

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

const buildRagConfig = async ({
  embeddingModel,
  vectorDb,
}: {
  embeddingModel?: string
  vectorDb?: string
}): Promise<ResolvedRagConfig> => {
  if (!embeddingModel || !vectorDb) {
    throw new HTTPError("RAG config not set", 422)
  }

  const vectorDbObj = await findVectorDb(vectorDb)
  if (!vectorDbObj) {
    throw new Error("Vector db not found")
  }

  const { apiKey, baseUrl, modelId } =
    await getLiteLLMModelConfigOrThrow(embeddingModel)
  return {
    embeddingModel: modelId,
    baseUrl,
    apiKey,
    vectorDb: vectorDbObj,
  }
}

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

const getEmbeddingModel = async (config: ResolvedRagConfig) => {
  const { llm } = createLiteLLMOpenAI({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  })
  return llm.embedding(config.embeddingModel)
}

const embedChunks = async (
  config: ResolvedRagConfig,
  chunks: string[],
  batchSize = DEFAULT_EMBEDDING_BATCH_SIZE
) => {
  const model = await getEmbeddingModel(config)
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

const isPdfFile = (file?: AgentFile) => {
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

const getTextFromBuffer = async (buffer: Buffer, file: AgentFile) => {
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

export const ingestAgentFile = async (
  agent: Agent,
  agentFile: AgentFile,
  fileBuffer: Buffer
): Promise<{
  inserted: number
  total: number
}> => {
  const { _id: agentId } = agent
  if (!agentId) {
    throw new Error("Agent id not set")
  }

  const config = await buildRagConfig(agent)
  const content = await getTextFromBuffer(fileBuffer, agentFile)
  const chunks = createChunksFromContent(content, agentFile.filename)

  const vectorDb = createVectorDb(config.vectorDb, {
    agentId,
  })

  if (chunks.length === 0) {
    // This will ensure any existing chunks for the source are removed
    await vectorDb.deleteBySourceIds([agentFile.ragSourceId])
    return { inserted: 0, total: 0 }
  }

  const embeddings = await embedChunks(config, chunks)
  if (embeddings.length !== chunks.length) {
    throw new Error("Embedding response size mismatch")
  }

  const payloads = chunks.map<ChunkInput>((chunk, index) => ({
    hash: hashChunk(chunk),
    text: chunk,
    embedding: embeddings[index],
  }))

  return await vectorDb.upsertSourceChunks(agentFile.ragSourceId, payloads)
}

export const deleteAgentFileChunks = async (
  agent: Agent,
  sourceIds: string[]
) => {
  if (!sourceIds || sourceIds.length === 0) {
    return
  }

  if (!agent.vectorDb) {
    throw new Error("Agent does not have a vectordb configured")
  }

  const vectorDbDoc = await findVectorDb(agent.vectorDb)
  if (!vectorDbDoc) {
    throw new Error(`Vector db ${agent.vectorDb} not found`)
  }

  const vectorDb = createVectorDb(vectorDbDoc, {
    agentId: agent._id!,
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

  const agentId = agent._id
  if (!agentId) {
    throw new Error("Agent id not set")
  }

  if (!agent.ragTopK || !agent.ragMinDistance) {
    throw new Error("RAG settings not properly configured")
  }

  const agentFiles = await agents.listAgentFiles(agent._id!)
  const readyFileSources = agentFiles
    .filter(file => file.status === AgentFileStatus.READY && file.ragSourceId)
    .map(file => file.ragSourceId)

  if (readyFileSources.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const config = await buildRagConfig({
    embeddingModel: agent.embeddingModel,
    vectorDb: agent.vectorDb,
  })
  const [queryEmbedding] = await embedChunks(config, [question], 1)
  if (!queryEmbedding?.length) {
    throw new Error("Embedding response missing dimensions")
  }

  const vectorDb = createVectorDb(config.vectorDb, {
    agentId,
  })
  const rows = await vectorDb.queryNearest(
    queryEmbedding,
    readyFileSources,
    agent.ragTopK
  )
  if (rows.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const maxDistance = 1 - agent.ragMinDistance
  const filtered = rows.filter(row => row.distance <= maxDistance)
  if (filtered.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const chunks: RetrievedContextChunk[] = filtered.map(row => ({
    sourceId: row.source,
    chunkText: row.chunkText,
    chunkHash: row.chunkHash,
  }))

  return {
    text: chunks.map(chunk => chunk.chunkText).join("\n\n"),
    chunks,
    sources: toSourceMetadata(chunks, agentFiles),
  }
}

const toSourceMetadata = (
  chunks: RetrievedContextChunk[],
  files: AgentFile[]
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
