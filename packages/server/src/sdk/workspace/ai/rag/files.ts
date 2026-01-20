import type { Agent, AgentFile, RagConfig, VectorDb } from "@budibase/types"
import * as crypto from "crypto"
import { PDFParse } from "pdf-parse"
import { parse as parseYaml } from "yaml"
import sdk from "../../.."
import { createVectorDb, type ChunkInput } from "../vectorDb/utils"
import { HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import { embedMany } from "ai"

const DEFAULT_CHUNK_SIZE = 1500
const DEFAULT_CHUNK_OVERLAP = 200
const DEFAULT_EMBEDDING_BATCH_SIZE = 64

interface ResolvedRagConfig {
  databaseUrl: string
  embeddingModel: string
  baseUrl: string
  apiKey: string
}

interface ChunkResult {
  inserted: number
  total: number
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

const buildRagConfig = async (
  ragConfig: RagConfig
): Promise<ResolvedRagConfig> => {
  const databaseUrl = await resolveVectorDatabaseConfig(ragConfig.vectorDb)

  const { apiKey, baseUrl, modelId } =
    await sdk.aiConfigs.getLiteLLMModelConfigOrThrow(ragConfig.embeddingModel)
  return {
    databaseUrl,
    embeddingModel: modelId,
    baseUrl,
    apiKey,
  }
}

const resolveVectorDatabaseConfig = async (
  vectorDbId: string
): Promise<string> => {
  const vectorDb = await sdk.vectorDbs.find(vectorDbId)
  if (!vectorDb) {
    throw new Error("Vector db not found")
  }

  // TODO: support other vector db types
  const connectionString = buildPgConnectionString(vectorDb)
  return connectionString
}

const getVectorDb = (config: ResolvedRagConfig, embeddingDimensions: number) =>
  createVectorDb({
    databaseUrl: config.databaseUrl,
    embeddingDimensions,
  })

const buildPgConnectionString = (config: VectorDb) => {
  const userPart = config.user ? encodeURIComponent(config.user) : ""
  const passwordPart = config.password
    ? `:${encodeURIComponent(config.password)}`
    : ""
  const auth = userPart || passwordPart ? `${userPart}${passwordPart}@` : ""
  return `postgresql://${auth}${config.host}:${config.port}/${config.database}`
}

const embeddingDimensionsCache = new Map<string, number>()

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
  const openai = ai.createLiteLLMOpenAI({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  })
  return openai.embedding(config.embeddingModel)
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

const getEmbeddingDimensions = async (config: ResolvedRagConfig) => {
  const cached = embeddingDimensionsCache.get(config.embeddingModel)
  if (cached) {
    return cached
  }
  const [embedding] = await embedChunks(config, ["dimension-check"], 1)
  const dimensions = embedding?.length || 0
  if (!dimensions) {
    throw new Error("Failed to resolve embedding dimensions")
  }
  embeddingDimensionsCache.set(config.embeddingModel, dimensions)
  return dimensions
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

export const getAgentRagConfig = async (agent: Agent): Promise<RagConfig> => {
  if (!agent.ragConfigId) {
    throw new HTTPError("RAG config not set", 422)
  }

  const config = await sdk.ragConfigs.find(agent.ragConfigId)
  if (!config) {
    throw new HTTPError("RAG config not found", 422)
  }
  return config
}

export const ingestAgentFile = async (
  agent: Agent,
  agentFile: AgentFile,
  fileBuffer: Buffer
): Promise<ChunkResult> => {
  const ragConfig = await getAgentRagConfig(agent)
  const config = await buildRagConfig(ragConfig)
  const content = await getTextFromBuffer(fileBuffer, agentFile)
  const chunks = createChunksFromContent(content, agentFile.filename)

  if (chunks.length === 0) {
    const embeddingDimensions = await getEmbeddingDimensions(config)
    const vectorDb = getVectorDb(config, embeddingDimensions)
    // This will ensure any existing chunks for the source are removed
    await vectorDb.upsertSourceChunks(agentFile.ragSourceId, [])
    return { inserted: 0, total: 0 }
  }

  const embeddings = await embedChunks(config, chunks)
  if (embeddings.length !== chunks.length) {
    throw new Error("Embedding response size mismatch")
  }
  const embeddingDimensions = embeddings[0]?.length || 0
  if (!embeddingDimensions) {
    throw new Error("Embedding response missing dimensions")
  }
  embeddingDimensionsCache.set(config.embeddingModel, embeddingDimensions)
  const vectorDb = getVectorDb(config, embeddingDimensions)

  const payloads: ChunkInput[] = chunks.map((chunk, index) => ({
    hash: hashChunk(chunk),
    text: chunk,
    embedding: embeddings[index],
  }))

  return await vectorDb.upsertSourceChunks(agentFile.ragSourceId, payloads)
}

export const deleteAgentFileChunks = async (
  ragConfig: RagConfig,
  sourceIds: string[]
) => {
  if (!sourceIds || sourceIds.length === 0) {
    return
  }
  const config = await buildRagConfig(ragConfig)
  const embeddingDimensions = await getEmbeddingDimensions(config)
  const vectorDb = getVectorDb(config, embeddingDimensions)
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
}

export const retrieveContextForSources = async (
  ragConfig: RagConfig,
  question: string,
  sourceIds: string[]
): Promise<RetrievedContextResult> => {
  if (!question || question.trim().length === 0 || sourceIds.length === 0) {
    return { text: "", chunks: [] }
  }

  const config = await buildRagConfig(ragConfig)
  const [queryEmbedding] = await embedChunks(config, [question], 1)
  const embeddingDimensions = queryEmbedding?.length || 0
  if (!embeddingDimensions) {
    throw new Error("Embedding response missing dimensions")
  }
  embeddingDimensionsCache.set(config.embeddingModel, embeddingDimensions)
  const vectorDb = getVectorDb(config, embeddingDimensions)
  const rows = await vectorDb.queryNearest(
    queryEmbedding,
    sourceIds,
    ragConfig.ragTopK
  )
  if (rows.length === 0) {
    return { text: "", chunks: [] }
  }

  const maxDistance =
    ragConfig.ragMinDistance === 0 ? 1 : 1 - ragConfig.ragMinDistance
  const filtered = rows.filter(row => row.distance <= maxDistance)
  if (filtered.length === 0) {
    return { text: "", chunks: [] }
  }

  const chunks: RetrievedContextChunk[] = filtered.map(row => ({
    sourceId: row.source,
    chunkText: row.chunkText,
    chunkHash: row.chunkHash,
  }))

  return {
    text: chunks.map(chunk => chunk.chunkText).join("\n\n"),
    chunks,
  }
}
