import { GetMigrationStatus } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface MigrationEndpoints {
  getMigrationStatus: () => Promise<GetMigrationStatus>
}

export const buildMigrationEndpoints = (
  API: BaseAPIClient
): MigrationEndpoints => ({
  /**
   * Gets the info about the current app migration
   */
  getMigrationStatus: async () => {
    return await API.get({
      url: "/api/migrations/status",
    })
  },
})
