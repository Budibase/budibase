export interface VectorDbRuntimeOptions {
  embeddingDimensions: number
  agentId: string
}

interface BaseVectorDbConfig {
  provider: string
}

export interface PgVectorDbConfig extends BaseVectorDbConfig {
  provider: "pgvector"
  databaseUrl: string
  embeddingDimensions: number
  tableName: string
}

export type VectorDbConfig = PgVectorDbConfig

export interface ChunkInput {
  hash: string
  text: string
  embedding: number[]
}

export interface QueryResultRow {
  source: string
  chunkText: string
  chunkHash: string
  distance: number
}

export interface VectorDb {
  upsertSourceChunks(
    sourceId: string,
    chunks: ChunkInput[]
  ): Promise<{ inserted: number; total: number }>

  deleteBySourceIds(sourceIds: string[]): Promise<void>

  queryNearest(
    embedding: number[],
    sourceIds: string[],
    topK: number
  ): Promise<QueryResultRow[]>
}
