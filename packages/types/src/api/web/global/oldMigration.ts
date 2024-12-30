import { Migration, MigrationOptions } from "../../../sdk"

export interface RunOldMigrationRequest extends MigrationOptions {}
export interface RuneOldMigrationResponse {
  message: string
}

export type FetchOldMigrationResponse = Migration[]

export interface GetOldMigrationStatus {
  migrated: boolean
}
