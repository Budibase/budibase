import { VectorDbProvider, type VectorDb as VectorDbDoc } from "@budibase/types"
import * as crypto from "crypto"
import { Client } from "pg"
import { context, db as dbCore, tenancy } from "@budibase/backend-core"
import type {
  ChunkInput,
  PgVectorDbConfig,
  QueryResultRow,
  VectorDb,
} from "./types"

const vectorLiteral = (values: number[]) =>
  `[${values.map(value => Number(value) || 0).join(",")}]`

const TABLE_PREFIX = "bb_agent_chunks_"
const TABLE_HASH_LENGTH = 10

const buildAgentTableName = (agentId: string) => {
  const normalized = agentId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  const currentWorkspaceId = context.getOrThrowWorkspaceId()
  const prodWorkspaceId = dbCore.getProdWorkspaceID(currentWorkspaceId)
  const hash = crypto
    .createHash("sha256")
    .update(`${tenancy.getTenantId()}:${prodWorkspaceId}:${agentId}`)
    .digest("hex")
    .slice(0, TABLE_HASH_LENGTH)
  const maxBaseLength = 63 - TABLE_PREFIX.length - 1 - TABLE_HASH_LENGTH
  const base = (normalized || "agent").slice(0, Math.max(0, maxBaseLength))
  return `${TABLE_PREFIX}${base}_${hash}`
}

const buildPgConnectionString = (config: VectorDbDoc) => {
  const userPart = config.user ? encodeURIComponent(config.user) : ""
  const passwordPart = config.password
    ? `:${encodeURIComponent(config.password)}`
    : ""
  const auth = userPart ? `${userPart}${passwordPart}@` : ""
  return `postgresql://${auth}${config.host}:${config.port}/${config.database}`
}

export const buildPgVectorDbConfig = (
  config: VectorDbDoc,
  options: { agentId: string }
) => {
  return new PgVectorDb({
    provider: VectorDbProvider.PGVECTOR,
    databaseUrl: buildPgConnectionString(config),
    tableName: buildAgentTableName(options.agentId),
  })
}

class PgVectorDb implements VectorDb {
  private readonly tableName: string

  constructor(private readonly config: PgVectorDbConfig) {
    if (!/^[a-z0-9_]+$/.test(config.tableName)) {
      throw new Error("Invalid vector table name")
    }
    this.tableName = config.tableName
  }

  private async withClient<T>(handler: (client: Client) => Promise<T>) {
    const client = new Client({
      connectionString: this.config.databaseUrl,
    })
    await client.connect()
    try {
      return await handler(client)
    } finally {
      await client.end()
    }
  }

  private async ensureSchema(client: Client, embeddingDimensions: number) {
    const buildIndexName = (tableName: string, suffix: string) => {
      const hash = crypto
        .createHash("sha256")
        .update(`${tableName}:${suffix}`)
        .digest("hex")
        .slice(0, 20)
      return `bb_sc_idx_${hash}`
    }

    await client.query("CREATE EXTENSION IF NOT EXISTS vector")
    await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          id SERIAL PRIMARY KEY,
          source TEXT NOT NULL,
          chunk_hash TEXT NOT NULL,
          chunk_text TEXT NOT NULL,
          embedding vector(${embeddingDimensions}) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `)
    await client.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS ${buildIndexName(this.tableName, "source_chunk_hash_uq")} ON ${this.tableName} (source, chunk_hash)`
    )
    await client.query(`
        CREATE INDEX IF NOT EXISTS ${buildIndexName(
          this.tableName,
          "embedding"
        )}
        ON ${this.tableName}
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
      `)
  }

  async upsertSourceChunks(
    sourceId: string,
    chunks: ChunkInput[]
  ): Promise<{ inserted: number; total: number }> {
    if (!chunks.length) {
      throw new Error("Chunks cannot be empty")
    }

    return await this.withClient(async client => {
      const embeddingDimensions = chunks[0].embedding.length
      if (embeddingDimensions === 0) {
        throw new Error("Embedding dimensions must be greater than 0")
      }
      await this.ensureSchema(client, embeddingDimensions)
      await client.query("BEGIN")
      try {
        const hashes = chunks.map(chunk => chunk.hash)

        await client.query(
          `DELETE FROM ${this.tableName} WHERE source = $1 AND NOT (chunk_hash = ANY($2::text[]))`,
          [sourceId, hashes]
        )

        const existing = await client.query(
          `SELECT chunk_hash FROM ${this.tableName} WHERE source = $1 AND chunk_hash = ANY($2::text[])`,
          [sourceId, hashes]
        )
        const existingHashes = new Set(existing.rows.map(row => row.chunk_hash))

        let inserted = 0
        for (const chunk of chunks) {
          if (existingHashes.has(chunk.hash)) {
            continue
          }
          await client.query(
            `
              INSERT INTO ${this.tableName} (source, chunk_hash, chunk_text, embedding)
              VALUES ($1, $2, $3, $4::vector)
              ON CONFLICT (source, chunk_hash) DO UPDATE
                SET chunk_text = EXCLUDED.chunk_text,
                    embedding = EXCLUDED.embedding
            `,
            [sourceId, chunk.hash, chunk.text, vectorLiteral(chunk.embedding)]
          )
          inserted += 1
        }

        await client.query("COMMIT")
        return { inserted, total: chunks.length }
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      }
    })
  }

  async deleteBySourceIds(sourceIds: string[]): Promise<void> {
    if (!sourceIds || sourceIds.length === 0) {
      return
    }

    await this.withClient(async client => {
      try {
        await client.query(
          `DELETE FROM ${this.tableName} WHERE source = ANY($1::text[])`,
          [sourceIds]
        )
      } catch (error: any) {
        if (error?.code === "42P01") {
          // Table does not exist
          return
        }
        throw error
      }
    })
  }

  async queryNearest(
    embedding: number[],
    sourceIds: string[],
    topK: number
  ): Promise<QueryResultRow[]> {
    if (!sourceIds || sourceIds.length === 0) {
      return []
    }

    return await this.withClient(async client => {
      const { rows } = await client.query(
        `
          SELECT source, chunk_text, chunk_hash, (embedding <=> $1::vector) AS distance
          FROM ${this.tableName}
          WHERE source = ANY($2::text[])
          ORDER BY embedding <=> $1::vector
          LIMIT $3
        `,
        [vectorLiteral(embedding), sourceIds, topK]
      )

      return rows.map(row => ({
        source: row.source,
        chunkText: row.chunk_text,
        chunkHash: row.chunk_hash,
        distance: Number(row.distance ?? 1),
      }))
    })
  }
}
