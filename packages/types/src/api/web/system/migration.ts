import { MigrationDefinition, MigrationOptions } from "../../../sdk"

export interface RunGlobalMigrationRequest extends MigrationOptions {}

export type FetchMigrationDefinitionsResponse = MigrationDefinition[]
