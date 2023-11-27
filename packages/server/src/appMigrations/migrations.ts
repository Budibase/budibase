// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

export const MIGRATIONS: Record<string, { migration: () => Promise<void> }> = {}
