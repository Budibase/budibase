import type { Client } from "pg"

export interface VectorStoreConfig {
  databaseUrl: string
  embeddingDimensions: number
}

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

export interface VectorStore {
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

export type ClientHandler<T> = (client: Client) => Promise<T>
