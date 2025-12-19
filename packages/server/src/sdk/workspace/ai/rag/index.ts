import { AIConfigType, type AgentFile } from "@budibase/types"
import * as crypto from "crypto"
import { Client } from "pg"
import { parse as parseYaml } from "yaml"
import { PDFParse } from "pdf-parse"
import sdk from "../../.."
import environment from "../../../../environment"

const TABLE_NAME = "bb_agent_chunks"
const DEFAULT_CHUNK_SIZE = 1500
const DEFAULT_CHUNK_OVERLAP = 200

interface RagConfig {
  databaseUrl: string
  embeddingModel: string
  embeddingDimensions: number
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

const buildRagConfig = async (): Promise<RagConfig> => {
  try {
    const { apiKey, baseUrl, modelId } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrowByType(
        undefined,
        AIConfigType.EMBEDDINGS
      )
    return {
      databaseUrl: environment.LITELLM_DATABASE_URL,
      embeddingModel: modelId,
      embeddingDimensions: environment.AGENT_FILE_EMBEDDING_DIMENSIONS,
      baseUrl,
      apiKey,
    }
  } catch (error) {
    const { apiKey, baseUrl, modelId } =
      await sdk.aiConfigs.getLiteLLMModelConfigOrThrow()
    return {
      databaseUrl: environment.LITELLM_DATABASE_URL,
      embeddingModel: modelId,
      embeddingDimensions: environment.AGENT_FILE_EMBEDDING_DIMENSIONS,
      baseUrl,
      apiKey,
    }
  }
}

const withClient = async <T>(
  config: RagConfig,
  handler: (client: Client) => Promise<T>
): Promise<T> => {
  const client = new Client({
    connectionString: config.databaseUrl,
  })
  await client.connect()
  try {
    return await handler(client)
  } finally {
    await client.end()
  }
}

const ensureSchema = async (client: Client, config: RagConfig) => {
  await client.query("CREATE EXTENSION IF NOT EXISTS vector")
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id SERIAL PRIMARY KEY,
      source TEXT NOT NULL,
      chunk_hash TEXT UNIQUE NOT NULL,
      chunk_text TEXT NOT NULL,
      embedding vector(${config.embeddingDimensions}) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await client.query(
    `CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_source_idx ON ${TABLE_NAME} (source)`
  )
  await client.query(`
    CREATE INDEX IF NOT EXISTS ${TABLE_NAME}_embedding_idx
    ON ${TABLE_NAME}
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100)
  `)
}

const vectorLiteral = (values: number[]) => {
  return `[${values.map(value => Number(value) || 0).join(",")}]`
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

const getEmbedding = async (config: RagConfig, text: string) => {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("Authorization", `Bearer ${config.apiKey}`)

  const response = await fetch(`${config.baseUrl}/v1/embeddings`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: config.embeddingModel,
      input: text,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Failed to create embedding (${response.status}): ${body || "Unknown"}`
    )
  }

  const json = await response.json()
  const embedding = json?.data?.[0]?.embedding
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Embedding response missing data")
  }
  return embedding as number[]
}

const upsertChunks = async (
  client: Client,
  config: RagConfig,
  sourceId: string,
  chunks: string[]
): Promise<ChunkResult> => {
  if (chunks.length === 0) {
    await client.query(`DELETE FROM ${TABLE_NAME} WHERE source = $1`, [
      sourceId,
    ])
    return { inserted: 0, total: 0 }
  }

  const hashes = chunks.map(chunk => hashChunk(chunk))

  await client.query(
    `DELETE FROM ${TABLE_NAME} WHERE source = $1 AND NOT (chunk_hash = ANY($2::text[]))`,
    [sourceId, hashes]
  )

  const existing = await client.query(
    `SELECT chunk_hash FROM ${TABLE_NAME} WHERE source = $1 AND chunk_hash = ANY($2::text[])`,
    [sourceId, hashes]
  )
  const existingHashes = new Set(existing.rows.map(row => row.chunk_hash))

  let inserted = 0
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i]
    const chunkHash = hashes[i]
    if (existingHashes.has(chunkHash)) {
      continue
    }
    const embedding = await getEmbedding(config, chunk)
    await client.query(
      `
        INSERT INTO ${TABLE_NAME} (source, chunk_hash, chunk_text, embedding)
        VALUES ($1, $2, $3, $4::vector)
        ON CONFLICT (chunk_hash) DO UPDATE
          SET chunk_text = EXCLUDED.chunk_text,
              embedding = EXCLUDED.embedding,
              source = EXCLUDED.source
      `,
      [sourceId, chunkHash, chunk, vectorLiteral(embedding)]
    )
    inserted += 1
  }

  return { inserted, total: chunks.length }
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
  agentFile: AgentFile,
  fileBuffer: Buffer
): Promise<ChunkResult> => {
  const config = await buildRagConfig()

  return await withClient(config, async client => {
    await ensureSchema(client, config)
    const content = await getTextFromBuffer(fileBuffer, agentFile)
    const chunks = createChunksFromContent(content, agentFile.filename)
    return await upsertChunks(client, config, agentFile.ragSourceId, chunks)
  })
}

export const deleteAgentFileChunks = async (sourceIds: string[]) => {
  if (!sourceIds || sourceIds.length === 0) {
    return
  }
  const config = await buildRagConfig()
  await withClient(config, async client => {
    await ensureSchema(client, config)
    await client.query(
      `DELETE FROM ${TABLE_NAME} WHERE source = ANY($1::text[])`,
      [sourceIds]
    )
  })
}

export interface RetrievedContextChunk {
  sourceId: string
  chunkText: string
  chunkHash: string
}

export interface RetrievedContextResult {
  text: string
  chunks: RetrievedContextChunk[]
}

export const retrieveContextForSources = async (
  question: string,
  sourceIds: string[],
  topK: number,
  similarityThreshold: number
): Promise<RetrievedContextResult> => {
  if (!question || question.trim().length === 0 || sourceIds.length === 0) {
    return { text: "", chunks: [] }
  }
  const config = await buildRagConfig()
  return await withClient(config, async client => {
    await ensureSchema(client, config)
    const queryEmbedding = await getEmbedding(config, question)
    const vector = vectorLiteral(queryEmbedding)
    const { rows } = await client.query(
      `
        SELECT source, chunk_text, chunk_hash, (embedding <=> $1::vector) AS distance
        FROM ${TABLE_NAME}
        WHERE source = ANY($2::text[])
        ORDER BY embedding <=> $1::vector
        LIMIT $3
      `,
      [vector, sourceIds, topK]
    )
    if (rows.length === 0) {
      return { text: "", chunks: [] }
    }

    const maxDistance = 1 - similarityThreshold
    const chunks: RetrievedContextChunk[] = rows
      .filter(row => {
        if (similarityThreshold === 0) {
          return true
        }
        const distance = Number(row.distance ?? 1)
        return distance <= maxDistance
      })
      .map(row => ({
        sourceId: row.source,
        chunkText: row.chunk_text,
        chunkHash: row.chunk_hash,
      }))
    if (chunks.length === 0) {
      return { text: "", chunks: [] }
    }
    return {
      text: chunks.map(chunk => chunk.chunkText).join("\n\n"),
      chunks,
    }
  })
}
