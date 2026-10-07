export interface FieldSchema {
  name: string
  type: string
  subtype?: string
  constraints?: {
    presence?: boolean | { allowEmpty?: boolean }
  }
}

export interface BudibaseTable {
  _id: string
  _rev: string
  name: string
  schema: Record<string, FieldSchema>
  primary?: string[]
  sourceType: string
  sourceId: string
}

export interface BudibaseRow {
  _id: string
  _rev: string
  [column: string]: unknown
}

export interface MigrateOptions {
  budibaseUrl: string
  email: string
  password: string
  tenantId: string
  appId: string
  tableId: string
  pgHost: string
  pgPort: number
  pgDatabase: string
  pgUser: string
  pgPassword: string
  pgSchema: string
  pgSsl: boolean
  pgTable?: string
  datasourceName?: string
  batchSize: number
  dryRun: boolean
}
