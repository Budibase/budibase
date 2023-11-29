// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

export const MIGRATIONS: {
  migrationId: string
  migrationFunc: () => Promise<void>
}[] = [
  // Migrations will be executed sorted by migrationId
]
