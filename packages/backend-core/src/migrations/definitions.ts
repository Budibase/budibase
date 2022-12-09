import {
  MigrationType,
  MigrationName,
  MigrationDefinition,
} from "@budibase/types"

export const DEFINITIONS: MigrationDefinition[] = [
  {
    type: MigrationType.GLOBAL,
    name: MigrationName.USER_EMAIL_VIEW_CASING,
  },
  {
    type: MigrationType.GLOBAL,
    name: MigrationName.SYNC_QUOTAS,
  },
  {
    type: MigrationType.APP,
    name: MigrationName.APP_URLS,
  },
  {
    type: MigrationType.APP,
    name: MigrationName.EVENT_APP_BACKFILL,
  },
  {
    type: MigrationType.APP,
    name: MigrationName.TABLE_SETTINGS_LINKS_TO_ACTIONS,
  },
  {
    type: MigrationType.GLOBAL,
    name: MigrationName.EVENT_GLOBAL_BACKFILL,
  },
  {
    type: MigrationType.INSTALLATION,
    name: MigrationName.EVENT_INSTALLATION_BACKFILL,
  },
  {
    type: MigrationType.GLOBAL,
    name: MigrationName.GLOBAL_INFO_SYNC_USERS,
  },
]
