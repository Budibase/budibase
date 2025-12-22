import { Client } from "pg"
import type {
  ChunkInput,
  QueryResultRow,
  VectorDb,
  VectorStoreConfig,
} from "./types"

const TABLE_NAME = "bb_agent_chunks"

const vectorLiteral = (values: number[]) =>
  `[${values.map(value => Number(value) || 0).join(",")}]`

export class PgVectorStore implements VectorDb {
  constructor(private readonly config: VectorStoreConfig) {}

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
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id SERIAL PRIMARY KEY,
        source TEXT NOT NULL,
        chunk_hash TEXT UNIQUE NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding vector(${this.config.embeddingDimensions}) NOT NULL,
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

  async upsertSourceChunks(
    sourceId: string,
    chunks: ChunkInput[]
  ): Promise<{ inserted: number; total: number }> {
    return await this.withClient(async client => {
      await this.ensureSchema(client)

      if (chunks.length === 0) {
        await client.query(`DELETE FROM ${TABLE_NAME} WHERE source = $1`, [
          sourceId,
        ])
        return { inserted: 0, total: 0 }
      }

      const hashes = chunks.map(chunk => chunk.hash)

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
      for (const chunk of chunks) {
        if (existingHashes.has(chunk.hash)) {
          continue
        }
        await client.query(
          `
            INSERT INTO ${TABLE_NAME} (source, chunk_hash, chunk_text, embedding)
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

      return { inserted, total: chunks.length }
    })
  }

  async deleteBySourceIds(sourceIds: string[]): Promise<void> {
    if (!sourceIds || sourceIds.length === 0) {
      return
    }
    await this.withClient(async client => {
      await this.ensureSchema(client)
      await client.query(
        `DELETE FROM ${TABLE_NAME} WHERE source = ANY($1::text[])`,
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
          FROM ${TABLE_NAME}
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
