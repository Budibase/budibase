import { MigrationDefinition, MigrationOptions } from "../../../sdk"

export interface RunGlobalMigrationRequest extends MigrationOptions {}
export interface RunGlobalMigrationResponse {
  message: string
}

export type FetchMigrationDefinitionsResponse = MigrationDefinition[]
