import { Migration, MigrationOptions } from "../../../sdk"

export interface RunOldMigrationRequest extends MigrationOptions {}

export type FetchOldMigrationResponse = Migration[]

export interface GetOldMigrationStatus {
  migrated: boolean
}
