import { Table, WithoutDocMetadata } from "@budibase/types"
import { create } from "./create"
import { getAllInternalTables } from "./getters"
import { events } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"

/**
 * Duplicates an internal table without its data
 * @param table - The table to duplicate
 * @param userId - The user performing the duplication
 * @returns The new duplicated table
 */
export async function duplicate(table: Table, userId?: string): Promise<Table> {
  const existingTables = await getAllInternalTables()
  const duplicatedName = helpers.duplicateName(
    table.name,
    existingTables.map(t => t.name)
  )

  const tableToCreate: WithoutDocMetadata<Table> = {
    name: duplicatedName,
    type: table.type,
    sourceType: table.sourceType,
    sourceId: table.sourceId,
    schema: { ...table.schema },
    views: table.views ? { ...table.views } : {},
    indexes: table.indexes ? { ...table.indexes } : undefined,
    // Don't include any data/rows - this is intentionally empty
  }

  const duplicatedTable = await create(tableToCreate, undefined, userId)
  await events.table.created(duplicatedTable)

  return duplicatedTable
}
