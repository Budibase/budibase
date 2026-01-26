import type { VectorDb as VectorDbDoc } from "@budibase/types"
import * as crypto from "crypto"
import { Client } from "pg"
import type {
  ChunkInput,
  PgVectorDbConfig,
  QueryResultRow,
  VectorDb,
  VectorDbRuntimeOptions,
} from "./types"
import { context } from "@budibase/backend-core"

const vectorLiteral = (values: number[]) =>
  `[${values.map(value => Number(value) || 0).join(",")}]`

const TABLE_PREFIX = "bb_agent_chunks_"
const TABLE_HASH_LENGTH = 10

const buildAgentTableName = (agentId: string) => {
  const normalized = agentId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  const hash = crypto
    .createHash("sha256")
    .update(context.getOrThrowWorkspaceId())
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
  const auth = userPart || passwordPart ? `${userPart}${passwordPart}@` : ""
  return `postgresql://${auth}${config.host}:${config.port}/${config.database}`
}

export const buildPgVectorDbConfig = (
  config: VectorDbDoc,
  options: VectorDbRuntimeOptions
): PgVectorDbConfig => {
  return {
    provider: "pgvector",
    databaseUrl: buildPgConnectionString(config),
    embeddingDimensions: options.embeddingDimensions,
    tableName: buildAgentTableName(options.agentId),
  }
}

export class PgVectorDb implements VectorDb {
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

  private async ensureSchema(client: Client) {
    await client.query("CREATE EXTENSION IF NOT EXISTS vector")
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id SERIAL PRIMARY KEY,
        source TEXT NOT NULL,
        chunk_hash TEXT UNIQUE NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding vector(${Number(this.config.embeddingDimensions)}) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(
      `CREATE INDEX IF NOT EXISTS ${this.tableName}_source_idx ON ${this.tableName} (source)`
    )
    await client.query(`
      CREATE INDEX IF NOT EXISTS ${this.tableName}_embedding_idx
      ON ${this.tableName}
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `)
  }

  async upsertSourceChunks(
    sourceId: string,
    chunks: ChunkInput[]
  ): Promise<{ inserted: number; total: number }> {
    return await this.withClient(async client => {
      await this.ensureSchema(client)
      await client.query("BEGIN")
      try {
        if (chunks.length === 0) {
          await client.query(
            `DELETE FROM ${this.tableName} WHERE source = $1`,
            [sourceId]
          )
          await client.query("COMMIT")
          return { inserted: 0, total: 0 }
        }

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
              ON CONFLICT (chunk_hash) DO UPDATE
                SET chunk_text = EXCLUDED.chunk_text,
                    embedding = EXCLUDED.embedding,
                    source = EXCLUDED.source
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
      await this.ensureSchema(client)
      await client.query(
        `DELETE FROM ${this.tableName} WHERE source = ANY($1::text[])`,
        [sourceIds]
      )
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
      await this.ensureSchema(client)
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
